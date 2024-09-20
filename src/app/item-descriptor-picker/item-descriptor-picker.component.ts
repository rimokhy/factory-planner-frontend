import {Component, EventEmitter, OnInit, output, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ItemDescriptorControllerService, ItemDescriptorDto} from "../factory-planner-api";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {lastValueFrom, Observable, startWith, switchMap} from "rxjs";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-item-descriptor-picker',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatDivider, NgIf, NgOptimizedImage, MatIcon,],
  templateUrl: './item-descriptor-picker.component.html',
  styleUrl: './item-descriptor-picker.component.scss'
})
export class ItemDescriptorPickerComponent implements OnInit {
  itemDescriptorFormControl = new FormControl<string | ItemDescriptorDto>('');
  selectedItem?: ItemDescriptorDto;
  filteredOptions!: Observable<ItemDescriptorDto[]>;
  itemNumberFormControl = new FormControl<number | null>(null);
  itemSelected = output<ItemDescriptorDto>();

  constructor(private readonly itemDescriptorService: ItemDescriptorControllerService) {}

  ngOnInit() {
    this.filteredOptions = this.itemDescriptorFormControl.valueChanges.pipe(startWith(''), switchMap(async value => {
      if (typeof value === 'string' && value !== '') {
        try {
          return this._filter(value)
        } catch (error) {
          console.warn('error filtering item', error);
        }
      }
      if (value !== null && typeof value === 'object') {
        this.selectedItem = value as ItemDescriptorDto;
        this.itemNumberFormControl.setValue(1)
        this.itemSelected.emit(value)
      }

      return []
    }));
  }

  displayFn(user: ItemDescriptorDto): string {
    return user && user.displayName ? user.displayName : '';
  }

  private async _filter(input: string): Promise<ItemDescriptorDto[]> {
    return lastValueFrom(this.itemDescriptorService.searchByDisplayNameLike(input))
  }
}
