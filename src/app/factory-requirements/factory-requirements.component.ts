import {Component, model, output, QueryList, Signal, signal, ViewChildren, WritableSignal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIconButton} from "@angular/material/button";
import {ItemDescriptorControllerService, ItemDescriptorDto} from "../factory-planner-api";
import {ItemDescriptorPickerComponent} from "../item-descriptor-picker/item-descriptor-picker.component";
import {isEmpty, isNil} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, lastValueFrom, Subject} from "rxjs";

interface Tmp {
  item: BehaviorSubject<ItemDescriptorDto | null>;

  requiredAmount: BehaviorSubject<number>;
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
  requiredFactoryItems: Tmp[] = []
  valueChanged = output<ItemDescriptorDto | null>()

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly itemDescriptorService: ItemDescriptorControllerService,
  ) {
    this.activatedRoute.queryParamMap.subscribe(async params => {
      if (!isEmpty(this.requiredFactoryItems)) {
        return;
      }
      const itemRequirements = params.getAll('factoryRequirement').map(e => JSON.parse(e))

      this.requiredFactoryItems = await Promise.all(itemRequirements.map(async e => {
        return this.createFactoryItemRequirement(await lastValueFrom(this.itemDescriptorService.findByClassName1(e.itemClass)), e.requiredAmount)
      }))
      this.valueChanged.emit(null)
      this.updateQueryParams()
    })
  }

  addFactoryRequirement() {
    return this.requiredFactoryItems.push(this.createFactoryItemRequirement(null))
  }

  createFactoryItemRequirement(item: ItemDescriptorDto | null, amount: number = 0): Tmp {
    const newItem = new BehaviorSubject<ItemDescriptorDto | null>(item)
    const newAmount = new BehaviorSubject<number>(amount)

    newItem.subscribe(value => {
      if (isNil(value)) {
        return
      }
      this.updateQueryParams()
      this.valueChanged.emit(value)
    })
    newAmount.subscribe(value => {
      this.updateQueryParams()
      this.valueChanged.emit(null)

    })

    return {
      item: newItem,
      requiredAmount: newAmount
    }
  }


  private updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        factoryRequirement: this.requiredFactoryItems.filter(e => !isNil(e.item)).map(e => JSON.stringify({
          itemClass: e.item.value?.className,
          requiredAmount: e.requiredAmount.value
        }))
      },
      queryParamsHandling: 'merge',
    });
  }

}
