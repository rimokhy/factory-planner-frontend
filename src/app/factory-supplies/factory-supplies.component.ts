import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AmountPickerComponent} from "../amount-picker/amount-picker.component";
import {ItemDescriptorPickerComponent} from "../item-descriptor-picker/item-descriptor-picker.component";
import {RecipePickerComponent} from "../recipe-picker/recipe-picker.component";
import {BehaviorSubject, lastValueFrom, Subject} from "rxjs";
import {GraphNavigator} from "../factory-requirements/graph/graph-navigator";
import {
  QueryParamSuppliedItem,
  SealedSuppliedItem,
  SuppliedItem
} from "../factory-requirements/factory-requirements.component";
import {isEmpty, isNil} from "lodash";
import {ItemDescriptorControllerService, ItemDescriptorDto} from "../factory-planner-api";

@Component({
  selector: 'app-factory-supplies',
  standalone: true,
  imports: [
    AmountPickerComponent,
    ItemDescriptorPickerComponent,
    RecipePickerComponent
  ],
  templateUrl: './factory-supplies.component.html',
  styleUrl: './factory-supplies.component.scss'
})
export class FactorySuppliesComponent {
  suppliedItems: SuppliedItem[] = []
  @Output() suppliedItemsUpdated: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private readonly itemDescriptorService: ItemDescriptorControllerService,
  ) {
  }

  async loadSuppliedItems(itemRequirements: QueryParamSuppliedItem[]): Promise<void> {
    if (isEmpty(itemRequirements)) {
      return;
    }
    this.suppliedItems = await Promise.all(itemRequirements.map(async req => {
      const item = await lastValueFrom(this.itemDescriptorService.findByClassName2(req.itemClass))

      return this.createSuppliedItem(item, req.providedAmount)
    }))
  }


  addSuppliedItem(item: ItemDescriptorDto | null = null) {
    return this.suppliedItems.push(this.createSuppliedItem(item))
  }

  private createSuppliedItem(item: ItemDescriptorDto | null, amount: number = 0): SuppliedItem {
    const newItem = new BehaviorSubject<ItemDescriptorDto | null>(item)

    const newAmount = new BehaviorSubject<number>(amount)

    newItem.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.suppliedItemsUpdated.emit(false)

    })

    newAmount.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.suppliedItemsUpdated.emit()
    })
    return {
      item: newItem,
      providedAmount: newAmount
    }
  }


  onSuppliedItemRemoved(idx: number) {
    this.suppliedItems = this.suppliedItems.filter((_, index) => index !== idx);
    this.suppliedItemsUpdated.emit(false)
  }

  getSealedSuppliedItems(): SealedSuppliedItem[] {
    return this.suppliedItems.filter(e => !isNil(e.item.value)).map(e => ({
      item: e.item.value!!,
      providedAmount: e.providedAmount.value
    }))
  }

}
