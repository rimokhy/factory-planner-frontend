import {ChangeDetectionStrategy, Component, effect, input, model, output} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {ItemDescriptorDto, RecipeControllerService, RecipeRequiringDto} from "../factory-planner-api";
import {BehaviorSubject, lastValueFrom, Subject} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";


@Component({
  selector: 'app-recipe-picker',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, AsyncPipe, NgIf],

  templateUrl: './recipe-picker.component.html',
  styleUrl: './recipe-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class RecipePickerComponent {
  readonly item = input.required<ItemDescriptorDto>();
  selectedRecipeClass = model<string>()
  selectedRecipe = output<RecipeRequiringDto>()
  recipes = new BehaviorSubject<RecipeRequiringDto[]>([])

  constructor(
    private readonly recipeService: RecipeControllerService
  ) {
    this.selectedRecipeClass.subscribe(recipeClass => {
      const recipe = this.recipes.value.find(e => e.className === recipeClass)

      if (recipe) {
        this.selectedRecipe.emit(recipe);
      } else {
        console.warn(`Supposed to emit recipe ${recipeClass}, but wasnt found in options`)
      }
    })
    effect(async () => {
      const itemRecipes = await lastValueFrom(this.recipeService.findAllByProducedItem(this.item().className))

      this.recipes.next(itemRecipes)
    })
  }

}
