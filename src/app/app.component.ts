import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RecipePickerComponent} from "./recipe-picker/recipe-picker.component";
import {ItemDescriptorPickerComponent} from "./item-descriptor-picker/item-descriptor-picker.component";
import {ItemDescriptorSummary} from "./factory-planner-api";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RecipePickerComponent, ItemDescriptorPickerComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'factory-planner';
  wouf?: ItemDescriptorSummary;

  setWouf(value: ItemDescriptorSummary) {
    console.log(value);
    this.wouf = value;

  }
}
