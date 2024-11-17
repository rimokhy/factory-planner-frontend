import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {lastValueFrom, Subject} from "rxjs";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {AsyncPipe, NgIf} from "@angular/common";
import {
  CraftingSiteNode,
  CraftingSiteRequest,
  ExtractingSiteNode,
  ExtractingSiteRequest,
  FactoryNode,
  FactoryPlannerControllerService,
  FactorySiteRequest,
  ItemSiteRequest
} from "../factory-planner-api";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {GraphNavigator, GraphNode} from "./graph/graph-navigator";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatDivider} from "@angular/material/divider";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {isNil} from "lodash";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";


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
export class FactorySitePreviewComponent implements AfterViewInit {
  updateGraph: Subject<boolean> = new Subject();
  graph = new GraphNavigator(this.updateGraph)
  @ViewChild(FactoryRequirementsComponent) requirements!: FactoryRequirementsComponent;


  constructor(
    private readonly factoryPlannerControllerService: FactoryPlannerControllerService,
  ) {

  }

  ngAfterViewInit(): void {
    this.graph.requirements = this.requirements;
  }

  async onRequirementsChanged() {
    this.requirements?.requiredFactoryItems.forEach((req) => {
      if (!isNil(req.item.value)) {
        this.populateGraph(this.makeItemSiteRequest(req.item.value.className))
      }
    })
  }

  async onNodeClick(nodeClicked: GraphNode) {
    const request = this.makeFactorySiteRequest(nodeClicked)

    return this.populateGraph(request)
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

  private makeFactorySiteRequest(nodeClicked: GraphNode): FactorySiteRequest {
    switch (nodeClicked.type) {
      case FactoryNode.TypeEnum.ItemSite:
        return this.makeItemSiteRequest(nodeClicked.factorySiteTarget.className);
      case FactoryNode.TypeEnum.CraftingSite:
        return this.makeCraftingSiteRequest(nodeClicked.factorySiteTarget.className, (nodeClicked as CraftingSiteNode).recipe.className);
      case FactoryNode.TypeEnum.ExtractorSite:
        return this.makeExtractingSiteRequest(nodeClicked.factorySiteTarget.className, (nodeClicked as ExtractingSiteNode).automaton.className)
    }
    console.error('Unhandled node type', nodeClicked);
    throw new Error('Unhandled node type');
  }

  private makeItemSiteRequest(itemClass: string): ItemSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.ItemSite,
      itemClass: itemClass,
    }
  }

  private makeCraftingSiteRequest(itemClass: string, recipeClass: string): CraftingSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.CraftingSite,
      itemClass: itemClass,
      recipeClass: recipeClass,
    }
  }

  private makeExtractingSiteRequest(itemClass: string, extractorClass: string): ExtractingSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.ExtractorSite,
      itemClass: itemClass,
      extractorClass: extractorClass,
    }
  }

  private async populateGraph(request: FactorySiteRequest) {
    const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(request))

    return this.graph.populate(graphResponse)
  }
}
