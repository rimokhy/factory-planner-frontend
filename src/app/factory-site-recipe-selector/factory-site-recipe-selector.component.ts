import {Component} from '@angular/core';
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {FactoryPlanningRequest} from "../factory-planner-api";

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
const TREE_DATA: FactoryPlanningRequest[] = [];


@Component({
  selector: 'app-recipe-picker',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './factory-site-recipe-selector.component.html',
  styleUrl: './factory-site-recipe-selector.component.scss',
})
export class RecipePickerComponent {
  treeControl = new NestedTreeControl<FactoryPlanningRequest>(node => node.ingredients);
  dataSource = new MatTreeNestedDataSource<FactoryPlanningRequest>();

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FactoryPlanningRequest) => !!node.ingredients && node.ingredients.length > 0;
}
