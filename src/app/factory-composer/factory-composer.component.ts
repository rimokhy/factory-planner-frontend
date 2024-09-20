import {Component, effect, input, Input, model, output, signal} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {RecipePickerComponent} from "../recipe-picker/recipe-picker.component";
import {ItemDescriptorDto, RecipeRequiringDto} from '../factory-planner-api';
import {AsyncPipe, NgIf} from "@angular/common";
import {MatOption} from "@angular/material/core";
import {Subject} from "rxjs";

@Component({
  selector: 'app-factory-composer',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    RecipePickerComponent,
    NgIf,
    AsyncPipe,
    MatOption
  ],
  templateUrl: './factory-composer.component.html',
  styleUrl: './factory-composer.component.scss'
})
export class FactoryComposerComponent {
  readonly panelOpenState = signal(true);
  readonly selectedRecipe = new Subject<RecipeRequiringDto>()
  readonly item = input.required<ItemDescriptorDto>();
  title: string = '';

  constructor() {
    effect(() => {
      this.title = `Select recipe for: ${this.item().displayName}`;
    })

    this.selectedRecipe.subscribe(e => {
      console.log('recipe updated')
      this.title = `Selected recipe: ${e.displayName}`
    })
  }
}
