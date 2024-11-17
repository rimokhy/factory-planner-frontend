import {Component, Input, model, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ItemDescriptorControllerService, ItemDescriptorDto} from "../factory-planner-api";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {BehaviorSubject, lastValueFrom, Observable, startWith, switchMap} from "rxjs";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {isNil} from "lodash";

@Component({
  selector: 'app-item-descriptor-picker',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatDivider, NgIf, NgOptimizedImage, MatIcon,],
  templateUrl: './item-descriptor-picker.component.html',
  styleUrl: './item-descriptor-picker.component.scss'
})
export class ItemDescriptorPickerComponent implements OnInit {
  itemDescriptorFormControl = new FormControl<string | ItemDescriptorDto>('');
  filteredOptions!: Observable<ItemDescriptorDto[]>;
  itemNumberFormControl = new FormControl<number | null>(null);
  @Input() itemSelected!: BehaviorSubject<ItemDescriptorDto | null>;
  @Input() amountSelected!: BehaviorSubject<number>;

  constructor(
    private readonly itemDescriptorService: ItemDescriptorControllerService,
  ) {
  }

  ngOnInit() {
    this.itemNumberFormControl.setValue(0)
    console.log(this.itemSelected)
    this.itemSelected.subscribe(value => {
      console.log('received')
      if (!isNil(value)) {
        this.itemDescriptorFormControl.setValue(value);
      }
    })

    this.amountSelected.subscribe(value => {
      if (!isNil(value)) {
        this.itemNumberFormControl.setValue(value);
      }
    })

    this.filteredOptions = this.itemDescriptorFormControl.valueChanges.pipe(startWith(''), switchMap(async value => {
      if (typeof value === 'string' && value !== '') {
        try {
          return this._filter(value)
        } catch (error) {
          console.warn('error filtering item', error);
        }
      }
      if (value !== null && typeof value === 'object' && value !== this.itemSelected.value) {
        console.log('emiting')
        this.itemSelected.next(value)
        this.itemNumberFormControl.setValue(1)
      }

      return []
    }));


    this.itemNumberFormControl.valueChanges.subscribe(value => {
      if (!isNil(value) && value !== this.amountSelected.value) {
        this.amountSelected.next(value)
      }
    })

  }

  displayFn(item: ItemDescriptorDto): string {
    return item && item.displayName ? item.displayName : '';
  }

  private async _filter(input: string): Promise<ItemDescriptorDto[]> {
    return lastValueFrom(this.itemDescriptorService.searchByDisplayNameLike(input))
  }
}
