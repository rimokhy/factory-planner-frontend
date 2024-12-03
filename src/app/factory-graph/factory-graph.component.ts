import {Component, Input, OnInit} from '@angular/core';
import {isNil} from "lodash";
import {GraphNavigator, GraphNode} from "../factory-requirements/graph/graph-navigator";
import {CraftingSiteNode, ExtractingSiteNode, FactoryNode} from "../factory-planner-api";
import {BehaviorSubject, Subject} from "rxjs";
import {isCraftingSiteNode, isExtractingSiteNode, isItemSiteNode} from "../factory-requirements/graph/node.factory";
import {AsyncPipe, NgIf} from "@angular/common";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-factory-graph',
  standalone: true,
  imports: [
    NgxGraphModule,
    AsyncPipe,
    MatCard,
    NgIf,
    MatCardContent,
    MatIcon,
    MatIconButton,
    MatButton,
    MatCardFooter,
    MatTooltip,
  ],
  templateUrl: './factory-graph.component.html',
  styleUrl: './factory-graph.component.scss'
})
export class FactoryGraphComponent implements OnInit {
  @Input() graphSubject!: BehaviorSubject<GraphNavigator | null>
  @Input() updateGraphSubject!: Subject<boolean>;
  @Input() requirements!: FactoryRequirementsComponent


  readonly isItemSiteNode = isItemSiteNode;
  readonly isCraftingSiteNode = isCraftingSiteNode;
  protected readonly isExtractingSiteNode = isExtractingSiteNode;

  ngOnInit() {
    this.graphSubject.subscribe(e => {
      if (isNil(e)) {
        return
      }

      this.updateGraphSubject.next(true);
    })
  }

  async onNodeClick(nodeClicked: GraphNode) {
    const graph = this.graphSubject.value

    if (isNil(graph)) {
      return
    }
    if (isItemSiteNode(nodeClicked) && this.requirements.getSealedRequirements().every(e => e.item.className !== nodeClicked.factorySiteTarget.className)) {
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
