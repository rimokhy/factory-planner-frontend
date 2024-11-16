import {Component} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {ItemDescriptorPickerComponent} from "../item-descriptor-picker/item-descriptor-picker.component";
import {FactorySitePreviewComponent} from "../factory-site-preview/factory-site-preview.component";
import {RecipePickerComponent} from "../recipe-picker/recipe-picker.component";
import {MatDivider} from "@angular/material/divider";
import {ItemDescriptorDto} from "../factory-planner-api";
import {Subject} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {GraphModule} from "@swimlane/ngx-graph";
import {FactoryComposerComponent} from "../factory-composer/factory-composer.component";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-factory-planner',
  standalone: true,
  imports: [
    MatToolbar,
    ItemDescriptorPickerComponent,
    FactorySitePreviewComponent,
    RecipePickerComponent,
    MatDivider,
    AsyncPipe,
    GraphModule,
    NgIf,
    FactoryComposerComponent,
    MatCard,
    MatCardContent
  ],
  templateUrl: './factory-planner.component.html',
  styleUrl: './factory-planner.component.scss'
})
export class FactoryPlannerComponent {
  itemDescriptor = new Subject<ItemDescriptorDto>();

  setFactorySiteItem(itemDescriptor: ItemDescriptorDto) {
    this.itemDescriptor.next(itemDescriptor);
  }
}
