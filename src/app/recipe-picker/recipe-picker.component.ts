import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatTreeModule} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {FactoryPlannerControllerService, ItemDescriptorSummary, RecipeSummary} from "../factory-planner-api";


@Component({
  selector: 'app-recipe-picker',
  standalone: true,
  imports: [
    MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule
  ],
  templateUrl: './recipe-picker.component.html',
  styleUrl: './recipe-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class RecipePickerComponent {
  @Input() item!: ItemDescriptorSummary;

  recipes: RecipeSummary[] = []

  constructor(
    private readonly factoryPlannerControllerService: FactoryPlannerControllerService
  ) {
  }
}
