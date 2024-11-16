import {Component, OnInit, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ItemDescriptorControllerService, ItemDescriptorDto} from "../factory-planner-api";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {lastValueFrom, Observable, startWith, switchMap} from "rxjs";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router} from "@angular/router";
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
  selectedItem?: ItemDescriptorDto;
  filteredOptions!: Observable<ItemDescriptorDto[]>;
  itemNumberFormControl = new FormControl<number | null>(null);
  itemSelected = output<ItemDescriptorDto>();

  constructor(
    private readonly itemDescriptorService: ItemDescriptorControllerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

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

        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            itemClass: this.selectedItem.className
          },
          queryParamsHandling: 'merge', // Conserve les paramètres existants
        });
      }

      return []
    }));
    this.activatedRoute.queryParamMap.subscribe(async params => {
      const itemClass = params.get('itemClass')

      if (isNil(itemClass) || this.selectedItem?.className === itemClass) {
        return
      }

      const item = await lastValueFrom(this.itemDescriptorService.findByClassName1(itemClass));

      this.itemDescriptorFormControl.setValue(item)
    })
  }

  displayFn(user: ItemDescriptorDto): string {
    return user && user.displayName ? user.displayName : '';
  }

  private async _filter(input: string): Promise<ItemDescriptorDto[]> {
    return lastValueFrom(this.itemDescriptorService.searchByDisplayNameLike(input))
  }
}
