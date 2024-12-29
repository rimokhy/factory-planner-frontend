import {ChangeDetectionStrategy, Component, Input, model, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {
  ExtractorDto,
  ItemDescriptorDto,
  RecipeControllerService,
  RecipeDto,
  RecipeRequiringDto
} from "../factory-planner-api";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {isNil} from "lodash";


@Component({
  selector: 'app-recipe-picker',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, AsyncPipe, NgIf],

  templateUrl: './recipe-picker.component.html',
  styleUrl: './recipe-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class RecipePickerComponent implements OnInit {
  NO_OPTION_ITEM = {label: 'None', value: 'NO_OPTION_ITEM'};
  @Input() itemSelected!: BehaviorSubject<ItemDescriptorDto | null>;
  @Input() recipeSelected!: BehaviorSubject<RecipeDto | ExtractorDto | null>;
  selectedRecipeClass = model<string>()
  recipes = new BehaviorSubject<RecipeRequiringDto[]>([])

  constructor(
    private readonly recipeService: RecipeControllerService
  ) {
    this.selectedRecipeClass.subscribe(recipeClass => {
      const recipe = this.recipes.value.find(e => e.className === recipeClass)
      const extractors = Array.from(this.itemSelected.value?.extractedIn || [])
      const extractor = extractors.find(e => e.className === recipeClass)


      if (recipeClass === this.NO_OPTION_ITEM.value) {
        this.recipeSelected.next(null)
      } else if (recipe) {
        this.recipeSelected.next(recipe);
      } else if (extractor) {
        this.recipeSelected.next(extractor);
      }
    })
  }

  ngOnInit(): void {
    this.itemSelected.subscribe(async item => {
      const className = item?.className

      if (!isNil(className)) {
        this.recipes.next(await lastValueFrom(this.recipeService.findAllByProducedItem(className)))
/*
 TODO: Changing item doesnt deselect the recipe
 When fixed, test reloading from requirements in path with recipe
        this.recipeSelected.next(null)
*/
      }
    })
    this.recipeSelected.subscribe(recipe => {
      if (recipe) {
        this.selectedRecipeClass.set(recipe.className)
      } else {
        this.selectedRecipeClass.set(undefined)
      }
    })
  }

}
