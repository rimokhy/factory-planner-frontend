import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {RecipePickerComponent} from "./recipe-picker/recipe-picker.component";
import {ItemDescriptorPickerComponent} from "./item-descriptor-picker/item-descriptor-picker.component";
import {ItemDescriptorDto} from "./factory-planner-api";
import {NgIf} from "@angular/common";
import {Nav, NavComponent} from "./nav/nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RecipePickerComponent, ItemDescriptorPickerComponent, NgIf, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Factory Planner';
  navigation: Nav[] = [
    {
      label: 'Power Generator Site',
      route: '/power-generator-planning',
    },
    {
      label: 'Plan Factory',
      route: '/factory-planning'
    },
    {
      label: 'Map',
      route: '/pranked'
    },
  ]

}
