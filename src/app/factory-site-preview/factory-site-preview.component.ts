import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, lastValueFrom, Subject} from "rxjs";
import {ClusterNode, Edge, NgxGraphModule, Node} from "@swimlane/ngx-graph";
import {AsyncPipe, NgIf} from "@angular/common";
import {
  CraftingSiteNode,
  CraftingSiteRequest,
  ExtractingSiteNode,
  ExtractingSiteRequest,
  FactoryEdge,
  FactoryNode,
  FactoryPlannerControllerService,
  FactorySiteRequest,
  GraphBuilderFactoryNodeFactoryEdge,
  GraphBuilderFactoryNodeFactoryEdgeNodesInner,
  ItemDescriptorDto,
  ItemSiteRequest
} from "../factory-planner-api";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";

enum NodeType {
  CraftingSite = 'CraftingSite',
  ExtractingSite = 'ExtractingSite',
  ItemSite = 'ItemSite',
}

type GraphNode = Node & GraphBuilderFactoryNodeFactoryEdgeNodesInner;
type GraphEdge = Edge & FactoryEdge;

class GraphNavigator {
  nodes: GraphNode[] = [];
  edges: GraphEdge[] = [];
  clusters: ClusterNode[] = [];


  async populate({nodes, edges}: GraphBuilderFactoryNodeFactoryEdge) {
    nodes.forEach((node: GraphNode) => {
      if (!this.isNodeExisting(node)) {
        this.nodes.push(node);
      }
    })

    edges.forEach(edge => {
      if (!this.isEdgeExisting(edge)) {
        this.edges.push(edge);
      }
    })
  }

  selectSite(site: CraftingSiteNode) {

  }

  private isNodeExisting(node: GraphNode): boolean {
    return this.nodes.some(e => e.id === node.id)
  }

  private isEdgeExisting(edge: FactoryEdge): boolean {
    return this.edges.some(e => e.source === edge.source && e.target === edge.target)
  }
}

@Component({
  selector: 'app-factory-site-preview',
  standalone: true,
  imports: [
    NgxGraphModule,
    AsyncPipe,
    NgIf,
    MatCard,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './factory-site-preview.component.html',
  styleUrl: './factory-site-preview.component.scss'
})
export class FactorySitePreviewComponent implements OnInit {
  @Input() siteItem!: Subject<ItemDescriptorDto>;
  graphSubject: BehaviorSubject<GraphNavigator>
  updateGraph: Subject<boolean> = new Subject();


  constructor(
    private readonly factoryPlannerControllerService: FactoryPlannerControllerService,
  ) {
    this.graphSubject = new BehaviorSubject<GraphNavigator>(new GraphNavigator());
  }

  ngOnInit(): void {
    this.siteItem.subscribe(item => {
      this.graphSubject.next(new GraphNavigator())
      this.populateGraph(this.makeItemSiteRequest(item.className, 25))
    })
  }

  async onNodeClick(nodeClicked: GraphNode) {
    console.log('nodeClicked', nodeClicked.dimension);
    const request = this.makeFactorySiteRequest(nodeClicked)
    console.log(request)

    return this.populateGraph(request)
  }

  onLinkClick(event: any) {
    console.log('Link clicked:', event);
  }

  private makeFactorySiteRequest(nodeClicked: GraphNode): FactorySiteRequest {
    switch (nodeClicked.type) {
      case FactoryNode.TypeEnum.ItemSite:
        return this.makeItemSiteRequest(nodeClicked.factorySiteTarget.className, nodeClicked.targetAmountPerCycle);
      case FactoryNode.TypeEnum.CraftingSite:
        return this.makeCraftingSiteRequest(nodeClicked.factorySiteTarget.className, nodeClicked.targetAmountPerCycle, (nodeClicked as CraftingSiteNode).recipe.className);
      case FactoryNode.TypeEnum.ExtractorSite:
        return this.makeExtractingSiteRequest(nodeClicked.factorySiteTarget.className, nodeClicked.targetAmountPerCycle, (nodeClicked as ExtractingSiteNode).automaton.className)
    }
    console.error('Unhandled node type', nodeClicked);
    throw new Error('Unhandled node type');
  }

  private makeItemSiteRequest(itemClass: string, amountPerCycle: number): ItemSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.ItemSite,
      itemClass: itemClass,
      targetAmountPerCycle: amountPerCycle
    }
  }

  private makeCraftingSiteRequest(itemClass: string, amountPerCycle: number, recipeClass: string): CraftingSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.CraftingSite,
      itemClass: itemClass,
      targetAmountPerCycle: amountPerCycle,
      recipeClass: recipeClass,
    }
  }

  private makeExtractingSiteRequest(itemClass: string, amountPerCycle: number, extractorClass: string): ExtractingSiteRequest {
    return {
      type: FactorySiteRequest.TypeEnum.ExtractorSite,
      itemClass: itemClass,
      targetAmountPerCycle: amountPerCycle,
      extractorClass: extractorClass,
    }
  }

  private async populateGraph(request: FactorySiteRequest) {
    const graph = this.graphSubject.value
    const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(request))

    return graph.populate(graphResponse).then(e => this.updateGraph.next(true))
  }

  getStyles(node: GraphNode) {
    return {

    }
  }



  getNodeIcon(node: GraphNode): string | undefined {
    switch (node.type) {
      case FactoryNode.TypeEnum.ItemSite:
        return node.factorySiteTarget.icon.link;
      case FactoryNode.TypeEnum.CraftingSite:
        return "zaefz";
      case FactoryNode.TypeEnum.ExtractorSite:
        return "zefzf"
    }
    return ''
  }
}
