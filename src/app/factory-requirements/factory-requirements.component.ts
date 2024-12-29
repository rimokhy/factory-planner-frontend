import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {
  ExtractorDto,
  FactoryPlannerControllerService,
  ItemDescriptorControllerService,
  ItemDescriptorDto,
  RecipeControllerService,
  RecipeDto
} from "../factory-planner-api";
import {ItemDescriptorPickerComponent} from "../item-descriptor-picker/item-descriptor-picker.component";
import {isEmpty, isEqual, isNil} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, lastValueFrom, Subject, take} from "rxjs";
import {GraphNavigator} from "./graph/graph-navigator";
import {SealedRequirement} from "./graph/node.factory";
import {makeFactorySiteRequest} from "./item-site.request";
import {AmountPickerComponent} from "../amount-picker/amount-picker.component";
import {RecipePickerComponent} from "../recipe-picker/recipe-picker.component";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";


export interface QueryParamRequirement {
  itemClass: string;
  recipeClass?: string;
  extractorClass?: string;
  requiredAmount: number;
}

interface Requirement {
  item: BehaviorSubject<ItemDescriptorDto | null>;
  manufacturing: BehaviorSubject<RecipeDto | ExtractorDto | null>;
  requiredAmount: BehaviorSubject<number>;
}

export interface SuppliedItem {
  item: BehaviorSubject<ItemDescriptorDto | null>,
  providedAmount: BehaviorSubject<number>;
}

export interface SealedSuppliedItem {
  item: ItemDescriptorDto;
  providedAmount: number;
}

export interface QueryParamSuppliedItem {
  itemClass: string;
  providedAmount: number;
}

export const isExtractor = (recipeOrExtractor: RecipeDto | ExtractorDto | undefined | null): recipeOrExtractor is ExtractorDto => {
  return !isNil(recipeOrExtractor) && 'extractCycleTime' in recipeOrExtractor && 'itemsPerCycle' in recipeOrExtractor
}
export const isRecipe = (recipeOrExtractor: RecipeDto | ExtractorDto | undefined): recipeOrExtractor is RecipeDto => {
  return !isNil(recipeOrExtractor) && 'manufacturingDuration' in recipeOrExtractor
}

@Component({
  selector: 'app-factory-requirements',
  standalone: true,
  imports: [
    MatIcon,
    MatListModule,
    MatButtonModule,
    ItemDescriptorPickerComponent,
    AmountPickerComponent,
    RecipePickerComponent,
    ScrollingModule,
  ],
  templateUrl: './factory-requirements.component.html',
  styleUrl: './factory-requirements.component.scss'
})
export class FactoryRequirementsComponent {
  requiredFactoryItems: Requirement[] = []
  suppliedItems: SuppliedItem[] = []
  @Input() graphSubject!: BehaviorSubject<GraphNavigator | null>
  @Input() updateGraphSubject!: Subject<boolean>;
  private graphCreating = false

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly itemDescriptorService: ItemDescriptorControllerService,
    private readonly recipeService: RecipeControllerService,
    private readonly factoryPlannerControllerService: FactoryPlannerControllerService,
  ) {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe(async params => {
      if (!isEmpty(this.requiredFactoryItems)) {
        return;
      }

      await this.loadFactoryRequirement(params.getAll('factoryRequirement').map(e => JSON.parse(e) as QueryParamRequirement))
      await this.loadSuppliedItems(params.getAll('suppliedItem').map(e => JSON.parse(e) as QueryParamSuppliedItem))

      await this.onRequirementChanged()
      this.updateQueryParams()
    })
  }

  private async loadFactoryRequirement(itemRequirements: QueryParamRequirement[]): Promise<void> {
    if (isEmpty(itemRequirements)) {
      return;
    }
    this.requiredFactoryItems = await Promise.all(itemRequirements.map(async req => {
      const item = await lastValueFrom(this.itemDescriptorService.findByClassName2(req.itemClass))
      let recipeOrExtractor: RecipeDto | ExtractorDto | null = null

      if (req.recipeClass) {
        recipeOrExtractor = await lastValueFrom(this.recipeService.findByClassName(req.recipeClass))
      }
      if (req.extractorClass && item.extractedIn) {
        recipeOrExtractor = Array.from(item.extractedIn).find(e => e.className === req.extractorClass) || null
      }

      return this.createFactoryItemRequirement(item, recipeOrExtractor, req.requiredAmount)
    }))
    this.requiredFactoryItems.forEach(e => {
      this.bindSubscriptions(e)
    })
  }

  private async loadSuppliedItems(itemRequirements: QueryParamSuppliedItem[]): Promise<void> {
    if (isEmpty(itemRequirements)) {
      return;
    }
    this.suppliedItems = await Promise.all(itemRequirements.map(async req => {
      const item = await lastValueFrom(this.itemDescriptorService.findByClassName2(req.itemClass))

      return this.createSupplitedItem(item, req.providedAmount)
    }))
  }

  addFactoryRequirement(item: ItemDescriptorDto | null = null, recipe: RecipeDto | ExtractorDto | null = null, amount: number = 0) {
    return this.requiredFactoryItems.push(this.bindSubscriptions(this.createFactoryItemRequirement(item, recipe, amount)))
  }

  addSupplitedItem(item: ItemDescriptorDto | null = null) {
    return this.suppliedItems.push(this.createSupplitedItem(item))
  }

  getSealedRequirements(): SealedRequirement[] {
    return this.requiredFactoryItems.filter(e => !isNil(e.item.value)).map(e => ({
      item: e.item.value!!,
      manufacturing: e.manufacturing.value || undefined,
      requiredAmount: e.requiredAmount.value
    }))
  }

  getSealedSuppliedItems(): SealedSuppliedItem[] {
    return this.suppliedItems.filter(e => !isNil(e.item.value)).map(e => ({
      item: e.item.value!!,
      providedAmount: e.providedAmount.value
    }))
  }

  async onRequirementChanged() {
    const sealed = this.getSealedRequirements()
    const existing = this.graphSubject?.value?.requirements

    if (!this.graphCreating && !isEqual(sealed, existing)) {
      this.graphCreating = true
      const newGraph = new GraphNavigator(sealed, this.getSealedSuppliedItems(), this.updateGraphSubject)
      const graphRequest = sealed.map(e => makeFactorySiteRequest(e))
      const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(graphRequest))

      newGraph.populate(graphResponse)

      this.graphSubject.next(newGraph)
      this.graphCreating = false
    }
  }

  updateQueryParams() {
    const factoryRequirement = this.getQueryParamRequirements()
    const sealedSupplied = this.getSealedSuppliedItems().map(e => ({
      ...e,
      itemClass: e.item.className,
      item: undefined,

    }))

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        factoryRequirement: factoryRequirement.map(e => JSON.stringify(e)),
        suppliedItem: sealedSupplied.map(e => JSON.stringify(e)),
      },
      queryParamsHandling: 'merge',
    });
  }

  onRequirementRemoved(idx: number) {
    this.requiredFactoryItems = this.requiredFactoryItems.filter((_, index) => index !== idx);

    this.updateQueryParams()
    this.onRequirementChanged()
  }

  onSuppliedItemRemoved(idx: number) {
    this.suppliedItems = this.suppliedItems.filter((_, index) => index !== idx);
    this.graphSubject.value?.actualizeGraph(this.getSealedRequirements())
  }

  private createFactoryItemRequirement(item: ItemDescriptorDto | null, recipe: RecipeDto | ExtractorDto | null, amount: number = 0): Requirement {
    const newItem = new BehaviorSubject<ItemDescriptorDto | null>(item)
    const newRecipe = new BehaviorSubject<RecipeDto | ExtractorDto | null>(recipe)
    const newAmount = new BehaviorSubject<number>(amount)

    return {
      item: newItem,
      manufacturing: newRecipe,
      requiredAmount: newAmount
    }
  }

  private createSupplitedItem(item: ItemDescriptorDto | null, amount: number = 0): SuppliedItem {
    const newItem = new BehaviorSubject<ItemDescriptorDto | null>(item)

    const newAmount = new BehaviorSubject<number>(amount)

    newItem.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.updateQueryParams()
      this.graphSubject.value?.actualizeGraph(this.getSealedRequirements(), this.getSealedSuppliedItems())

    })

    newAmount.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.updateQueryParams()
      this.graphSubject.value?.actualizeGraph(this.getSealedRequirements(), this.getSealedSuppliedItems())

    })
    return {
      item: newItem,
      providedAmount: newAmount
    }
  }

  private bindSubscriptions(req: Requirement): Requirement {
    const {item, requiredAmount, manufacturing} = req

    item.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.onRequirementChanged()
      this.updateQueryParams()
    })
    manufacturing.subscribe(value => {
      this.onRequirementChanged()
      this.updateQueryParams()
    })
    requiredAmount.subscribe(value => {
      // TODO Changing amount deselect the recipe
      this.graphSubject.value?.actualizeGraph(this.getSealedRequirements(), this.getSealedSuppliedItems())
      this.updateQueryParams()
    })

    return req
  }

  private getQueryParamRequirements(): QueryParamRequirement[] {
    const sealedReq = this.getSealedRequirements()

    return sealedReq.map(({item, manufacturing, requiredAmount}) => {
      const recipeClass = isRecipe(manufacturing) ? manufacturing.className : undefined
      const extractorClass = isExtractor(manufacturing) ? manufacturing.className : undefined

      return ({
        itemClass: item.className,
        requiredAmount: requiredAmount,
        recipeClass,
        extractorClass
      });
    })
  }
}
