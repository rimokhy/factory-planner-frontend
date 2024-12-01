import {ChangeDetectionStrategy, Component, Input, model, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {ItemDescriptorDto, RecipeControllerService, RecipeDto, RecipeRequiringDto} from "../factory-planner-api";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";


@Component({
  selector: 'app-recipe-picker',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, AsyncPipe, NgIf],

  templateUrl: './recipe-picker.component.html',
  styleUrl: './recipe-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class RecipePickerComponent implements OnInit {
  @Input() itemSelected!: BehaviorSubject<ItemDescriptorDto | null>;
  @Input() recipeSelected!: BehaviorSubject<RecipeDto | null>;
  selectedRecipeClass = model<string>()
  recipes = new BehaviorSubject<RecipeRequiringDto[]>([])

  constructor(
    private readonly recipeService: RecipeControllerService
  ) {
    this.selectedRecipeClass.subscribe(recipeClass => {
      const recipe = this.recipes.value.find(e => e.className === recipeClass)

      if (recipe) {
        this.recipeSelected.next(recipe);
      } else {
        console.warn(`Supposed to emit recipe ${recipeClass}, but wasnt found in options`)
      }
    })
  }

  ngOnInit(): void {
    this.itemSelected.subscribe(async item => {
      if (item?.className) {
        this.recipes.next(await lastValueFrom(this.recipeService.findAllByProducedItem(item?.className)))
      }
    })
    this.recipeSelected.subscribe(recipe => {
      if (recipe) {
        this.selectedRecipeClass.set(recipe.className)
      }
    })
  }

}
