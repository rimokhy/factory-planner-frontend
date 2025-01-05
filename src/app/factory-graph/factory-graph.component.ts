import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GraphNavigator, GraphNode} from "../factory-requirements/graph/graph-navigator";
import {BehaviorSubject, Subject} from "rxjs";
import {
  isCraftingSiteNode,
  isExtractingSiteNode,
  isExtractionNode,
  isItemSiteNode
} from "../factory-requirements/graph/node.factory";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ExtractingSiteNodeImpl} from "../factory-requirements/graph/extracting-site.node";
import {ItemSiteNodeImpl} from "../factory-requirements/graph/item-site.node";
import {CraftingSiteNodeImpl} from "../factory-requirements/graph/crafting-site.node";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";

import {FormControl, FormsModule, Validators} from "@angular/forms";
import {isRecipe} from "../factory-requirements/factory-requirements.component";

@Component({
  selector: 'app-factory-graph',
  standalone: true,
  imports: [
    NgxGraphModule,
    AsyncPipe,
    MatCardModule,
    NgIf,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSliderModule,
  ],
  templateUrl: './factory-graph.component.html',
  styleUrl: './factory-graph.component.scss'
})
export class FactoryGraphComponent {
  @Input() graphSubject!: BehaviorSubject<GraphNavigator | null>
  @Input() updateGraphSubject!: Subject<boolean>
  @Output() nodeClicked: EventEmitter<GraphNode> = new EventEmitter<GraphNode>()

  readonly isItemSiteNode = isItemSiteNode;
  readonly isCraftingSiteNode = isCraftingSiteNode;

  constructor(
  ) {
  }

  async onNodeClick(nodeClicked: GraphNode) {
    this.nodeClicked.emit(nodeClicked)
  }

  getNodeIcon(node: GraphNode): string | undefined {
    if (node instanceof CraftingSiteNodeImpl) return node.automaton.descriptor.icon.link
    if (node instanceof ExtractingSiteNodeImpl) return node.automaton.descriptor.icon.link
    if (node instanceof ItemSiteNodeImpl || isExtractionNode(node)) return node.factorySiteTarget.icon.link;
    return undefined
  }

  getNodeTooltip(node: GraphNode): string | undefined {
    if (node instanceof ItemSiteNodeImpl) return node.factorySiteTarget.displayName;
    if (node instanceof CraftingSiteNodeImpl) return node.automaton.displayName
    if (node instanceof ExtractingSiteNodeImpl) return node.automaton.displayName

    return undefined
  }

  getNodeHeight(node: GraphNode): number {
    return 100
  }

  getNodeWidth(node: any): number {
    return 250
  }

  protected readonly isExtractingSiteNode = isExtractingSiteNode;
  protected readonly isExtractionNode = isExtractionNode;
}
