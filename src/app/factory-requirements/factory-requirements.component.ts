import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIconButton} from "@angular/material/button";
import {
  CraftingSiteRequest,
  ExtractingSiteRequest,
  ExtractorDto,
  FactoryPlannerControllerService,
  FactorySiteRequest,
  ItemDescriptorControllerService,
  ItemDescriptorDto,
  ItemSiteRequest,
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


export interface QueryParamRequirement {
  itemClass: string;
  recipeClass?: string;
  extractorClass?: string;
  requiredAmount: number;
}

interface Requirements {
  item: BehaviorSubject<ItemDescriptorDto | null>;
  manufacturing: BehaviorSubject<RecipeDto | ExtractorDto | null>;
  requiredAmount: BehaviorSubject<number>;
}

export const isExtractor = (recipeOrExtractor: RecipeDto | ExtractorDto | undefined): recipeOrExtractor is ExtractorDto => {
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
    MatDivider,
    MatCardContent,
    MatCard,
    MatCardFooter,
    MatList,
    MatListItem,
    MatIconButton,
    ItemDescriptorPickerComponent
  ],
  templateUrl: './factory-requirements.component.html',
  styleUrl: './factory-requirements.component.scss'
})
export class FactoryRequirementsComponent {
  requiredFactoryItems: Requirements[] = []
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
      const itemRequirements = params.getAll('factoryRequirement').map(e => JSON.parse(e) as QueryParamRequirement)
      if (isEmpty(itemRequirements)) {
        return;
      }
      this.requiredFactoryItems = await Promise.all(itemRequirements.map(async req => {
        const item = await lastValueFrom(this.itemDescriptorService.findByClassName1(req.itemClass))
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
      await this.onRequirementChanged()
      this.updateQueryParams()
    })
  }

  addFactoryRequirement(item: ItemDescriptorDto | null = null, recipe: RecipeDto | ExtractorDto | null = null, amount: number = 0) {
    return this.requiredFactoryItems.push(this.bindSubscriptions(this.createFactoryItemRequirement(item, recipe, amount)))
  }

  getSealedRequirements(): SealedRequirement[] {
    return this.requiredFactoryItems.filter(e => !isNil(e.item.value)).map(e => ({
      item: e.item.value!!,
      manufacturing: e.manufacturing.value || undefined,
      requiredAmount: e.requiredAmount.value
    }))
  }

  async onRequirementChanged() {
    const sealed = this.getSealedRequirements()
    const existing = this.graphSubject.value?.requirements

    if (!this.graphCreating && !isEqual(sealed, existing)) {
      this.graphCreating = true
      const newGraph = new GraphNavigator(sealed, this.updateGraphSubject)
      const graphRequest = sealed.map(e => makeFactorySiteRequest(e))
      const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(graphRequest))

      newGraph.populate(graphResponse)

      this.graphSubject.next(newGraph)
      this.graphCreating = false
    }
  }

  updateQueryParams() {
    const factoryRequirement = this.getQueryParamRequirements()

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        factoryRequirement: factoryRequirement.map(e => JSON.stringify(e)),
      },
      queryParamsHandling: 'merge',
    });
  }

  private createFactoryItemRequirement(item: ItemDescriptorDto | null, recipe: RecipeDto | ExtractorDto | null, amount: number = 0): Requirements {
    const newItem = new BehaviorSubject<ItemDescriptorDto | null>(item)
    const newRecipe = new BehaviorSubject<RecipeDto | ExtractorDto | null>(recipe)
    const newAmount = new BehaviorSubject<number>(amount)

    return {
      item: newItem,
      manufacturing: newRecipe,
      requiredAmount: newAmount
    }
  }

  private bindSubscriptions(req: Requirements): Requirements {
    const {item, requiredAmount,manufacturing} = req

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
      this.graphSubject.value?.actualizeGraph(this.getSealedRequirements())
      this.updateQueryParams()
    })

    return req
  }

  private getQueryParamRequirements(): QueryParamRequirement[] {
    const sealed = this.getSealedRequirements()

    return sealed.map(({item, manufacturing, requiredAmount}) => {
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



  onRequirementRemoved(idx: number) {
    delete this.requiredFactoryItems[idx]
    this.requiredFactoryItems = this.requiredFactoryItems.filter((_, index) => index !== idx);

    this.updateQueryParams()
    this.onRequirementChanged()
  }
}
