import {Component, EventEmitter, Input, Output} from '@angular/core';
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
import {BehaviorSubject, lastValueFrom, skip, Subject, take} from "rxjs";
import {GraphNavigator} from "../factory-graph/graph/graph-navigator";
import {SealedRequirement} from "../factory-graph/graph/node.factory";
import {makeFactorySiteRequest} from "./item-site.request";
import {AmountPickerComponent} from "../amount-picker/amount-picker.component";
import {RecipePickerComponent} from "../recipe-picker/recipe-picker.component";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {CdkListbox} from "@angular/cdk/listbox";


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
    CdkListbox,
  ],
  templateUrl: './factory-requirements.component.html',
  styleUrl: './factory-requirements.component.scss'
})
export class FactoryRequirementsComponent {
  requiredFactoryItems: Requirement[] = []
  @Output() requirementUpdated: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private readonly itemDescriptorService: ItemDescriptorControllerService,
    private readonly recipeService: RecipeControllerService,
  ) {
  }

  isFilled() {
    return !isEmpty(this.requiredFactoryItems)
  }

  async loadFactoryRequirement(itemRequirements: QueryParamRequirement[]): Promise<void> {
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
    this.requiredFactoryItems.forEach(({item, requiredAmount, manufacturing}) => {
      item.pipe(skip(1)).subscribe(value => {
        if (isNil(value)) {
          return
        }
        this.requirementUpdated.emit(true)
      })
      manufacturing.pipe(skip(1)).subscribe(value => {
        this.requirementUpdated.emit(true)
      })
      requiredAmount.pipe(skip(1)).subscribe(value => {
        this.requirementUpdated.emit(false)
      })
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

  onRequirementRemoved(idx: number) {
    this.requiredFactoryItems = this.requiredFactoryItems.filter((_, index) => index !== idx);

    this.requirementUpdated.emit(true)
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

  private bindSubscriptions(req: Requirement): Requirement {
    const {item, requiredAmount, manufacturing} = req

    item.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.requirementUpdated.emit(true)
    })
    manufacturing.subscribe(value => {
      this.requirementUpdated.emit(true)
    })
    requiredAmount.subscribe(value => {
      this.requirementUpdated.emit(false)
    })

    return req
  }
}
