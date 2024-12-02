import {Component, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {AsyncPipe, NgIf} from "@angular/common";
import {CraftingSiteNode, ExtractingSiteNode, FactoryNode} from "../factory-planner-api";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatDivider} from "@angular/material/divider";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {GraphNavigator, GraphNode} from "../factory-requirements/graph/graph-navigator";
import {isCraftingSiteNode, isExtractingSiteNode, isItemSiteNode } from '../factory-requirements/graph/node.factory';
import {isNil} from "lodash";


@Component({
  selector: 'app-factory-site-preview',
  standalone: true,
  imports: [
    NgxGraphModule,
    AsyncPipe,
    NgIf,
    MatCard,
    MatCardContent,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatDivider,
    FactoryRequirementsComponent,
    MatIconButton,
    MatButton,
    MatCardFooter,
    MatTooltip
  ],
  templateUrl: './factory-site-preview.component.html',
  styleUrl: './factory-site-preview.component.scss'
})
export class FactorySitePreviewComponent {
  updateGraph: Subject<boolean> = new Subject();
  graphSubject = new BehaviorSubject<GraphNavigator | null>(null)
  @ViewChild(FactoryRequirementsComponent) requirements!: FactoryRequirementsComponent;

  readonly isItemSiteNode = isItemSiteNode;
  readonly isCraftingSiteNode = isCraftingSiteNode;
  protected readonly isExtractingSiteNode = isExtractingSiteNode;

  constructor() {
    this.graphSubject.subscribe(e => {
      if (isNil(e)) {
        return
      }

      this.updateGraph.next(true);
    })
  }

  async onNodeClick(nodeClicked: GraphNode) {
    const graph = this.graphSubject.value

    if (isNil(graph)) {
      return
    }
    if (isItemSiteNode(nodeClicked) && this.requirements.getSealedRequirements().every(e => e.item.className !== nodeClicked.factorySiteTarget.className)) {
      console.log('Clicked',nodeClicked.factorySiteTarget)
      this.requirements.addFactoryRequirement(nodeClicked.factorySiteTarget)
      this.requirements.onRequirementChanged()
      this.requirements.updateQueryParams()
    }
  }

  getNodeIcon(node: GraphNode): string | undefined {
    switch (node.type) {
      case FactoryNode.TypeEnum.ItemSite:
        return node.factorySiteTarget.icon.link;
      case FactoryNode.TypeEnum.CraftingSite:
        return (node as CraftingSiteNode).automaton.descriptor.icon.link;
      case FactoryNode.TypeEnum.ExtractorSite:
        return (node as ExtractingSiteNode).automaton.descriptor.icon.link
    }
    return undefined
  }

  getNodeTooltip(node: GraphNode): string | undefined {
    switch (node.type) {
      case FactoryNode.TypeEnum.ItemSite:
        return node.factorySiteTarget.displayName;
      case FactoryNode.TypeEnum.CraftingSite:
        return (node as CraftingSiteNode).automaton.displayName;
      case FactoryNode.TypeEnum.ExtractorSite:
        return (node as ExtractingSiteNode).automaton.displayName;
    }
    return undefined
  }
}
