import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ItemDescriptorControllerService, ItemDescriptorSummary} from "../factory-planner-api";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe} from "@angular/common";
import {lastValueFrom, Observable, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-item-descriptor-picker',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe,],
  templateUrl: './item-descriptor-picker.component.html',
  styleUrl: './item-descriptor-picker.component.scss'
})
export class ItemDescriptorPickerComponent implements OnInit {
  myControl = new FormControl<string | ItemDescriptorSummary>('');
  filteredOptions!: Observable<ItemDescriptorSummary[]>;
  @Output() itemSelected: EventEmitter<ItemDescriptorSummary> = new EventEmitter();

  constructor(private readonly itemDescriptorService: ItemDescriptorControllerService) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), switchMap(async value => {
      if (typeof value === 'string' && value !== '') {
        try {
          return this._filter(value)
        } catch (error) {
          console.warn('error filtering item', error);
        }
      }
      if (value !== null && typeof value === 'object') {
        this.itemSelected.emit(value)
      }

      return []
    }));
  }
  wouf() {
    console.log('wouf')
  }

  displayFn(user: ItemDescriptorSummary): string {
    return user && user.displayName ? user.displayName : '';
  }

  private async _filter(input: string): Promise<ItemDescriptorSummary[]> {
    return lastValueFrom(this.itemDescriptorService.searchByDisplayNameLike(input))
  }
}
