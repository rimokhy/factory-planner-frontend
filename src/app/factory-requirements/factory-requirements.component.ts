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
import {isEmpty, isNil} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {GraphNavigator} from "./graph/graph-navigator";
import {SealedRequirement} from "./graph/node.factory";


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

export const isExtractor = (recipeOrExtractor: RecipeDto | ExtractorDto | null): recipeOrExtractor is ExtractorDto => {
  return !isNil(recipeOrExtractor) && 'extractCycleTime' in recipeOrExtractor && 'itemsPerCycle' in recipeOrExtractor
}
export const isRecipe = (recipeOrExtractor: RecipeDto | ExtractorDto | null): recipeOrExtractor is RecipeDto => {
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly itemDescriptorService: ItemDescriptorControllerService,
    private readonly recipeService: RecipeControllerService,
    private readonly factoryPlannerControllerService: FactoryPlannerControllerService,
  ) {
    this.activatedRoute.queryParamMap.subscribe(async params => {
      if (!isEmpty(this.requiredFactoryItems)) {
        return;
      }
      const itemRequirements = params.getAll('factoryRequirement').map(e => JSON.parse(e))

      this.requiredFactoryItems = await Promise.all(itemRequirements.map(async e => {
        let recipe: RecipeDto | null = null

        if (e.recipeClass) {
          recipe = await lastValueFrom(this.recipeService.findByClassName(e.recipeClass))
        }
        return this.createFactoryItemRequirement(await lastValueFrom(this.itemDescriptorService.findByClassName1(e.itemClass)), recipe, e.requiredAmount)
      }))
      await this.onRequirementChanged()
      this.updateQueryParams()
    })
  }

  addFactoryRequirement(item: ItemDescriptorDto | null = null, recipe: RecipeDto | ExtractorDto | null = null, amount: number = 0) {
    return this.requiredFactoryItems.push(this.createFactoryItemRequirement(item, recipe, amount))
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

    if (isEmpty(sealed)) {
      return
    }

    const newGraph = new GraphNavigator(sealed)
    const graphRequest = sealed.map(e => this.makeFactorySiteRequest(e))
    const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(graphRequest))

    newGraph.populate(graphResponse)

    this.graphSubject.next(newGraph)
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

    newItem.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.onRequirementChanged()
      this.updateQueryParams()
    })
    newRecipe.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.onRequirementChanged()
      this.updateQueryParams()
    })
    newAmount.subscribe(value => {
      this.graphSubject.value?.actualizeGraph()
      this.updateQueryParams()
    })

    return {
      item: newItem,
      manufacturing: newRecipe,
      requiredAmount: newAmount
    }
  }

  private getQueryParamRequirements(): QueryParamRequirement[] {
    const sealed = this.getSealedRequirements()

    return sealed.map(({item, manufacturing, requiredAmount}) => ({
      itemClass: item.className,
      recipeClass: manufacturing?.className,
      requiredAmount: requiredAmount
    }))
  }

  private makeFactorySiteRequest(requirement: SealedRequirement): FactorySiteRequest {
    if (isNil(requirement.manufacturing)) {
      return this.makeItemSiteRequest(requirement.item.className);
    }
    if (isRecipe(requirement.manufacturing)) {
      return this.makeCraftingSiteRequest(requirement.item.className, requirement.manufacturing.className);
    }
    if (isExtractor(requirement.manufacturing)) {
      return this.makeExtractingSiteRequest(requirement.item.className, requirement.manufacturing.className)
    }

    console.error('Unhandled req', requirement);
    throw new Error('Unhandled req');
  }

  private makeItemSiteRequest(itemClass: string): ItemSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.ItemSite,
      itemClass: itemClass,
    }
  }

  private makeCraftingSiteRequest(itemClass: string, recipeClass: string): CraftingSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.CraftingSite,
      itemClass: itemClass,
      recipeClass: recipeClass,
    }
  }

  private makeExtractingSiteRequest(itemClass: string, extractorClass: string): ExtractingSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.ExtractorSite,
      itemClass: itemClass,
      extractorClass: extractorClass,
    }
  }
}
