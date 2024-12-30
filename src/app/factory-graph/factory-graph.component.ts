import {Component, Input, OnInit} from '@angular/core';
import {isNil} from "lodash";
import {GraphNavigator, GraphNode} from "../factory-requirements/graph/graph-navigator";
import {BehaviorSubject, Subject} from "rxjs";
import {
  isCraftingSiteNode,
  isExtractingSiteNode,
  isExtractionNode,
  isItemSiteNode
} from "../factory-requirements/graph/node.factory";
import {AsyncPipe, NgIf} from "@angular/common";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {MatCardModule} from "@angular/material/card";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ExtractingSiteNodeImpl} from "../factory-requirements/graph/extracting-site.node";
import {ItemSiteNodeImpl} from "../factory-requirements/graph/item-site.node";
import {CraftingSiteNodeImpl} from "../factory-requirements/graph/crafting-site.node";
import {MatMenuModule} from "@angular/material/menu";
import {FactoryNode} from "../factory-planner-api";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {ExtractingSiteService, Purity} from "../extracting-site-config/extracting-site-config.service";
import {FormsModule} from "@angular/forms";

function randomString(len: number) {
  const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
}

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
export class FactoryGraphComponent implements OnInit {
  @Input() graphSubject!: BehaviorSubject<GraphNavigator | null>
  @Input() updateGraphSubject!: Subject<boolean>;
  @Input() requirements!: FactoryRequirementsComponent

  readonly isItemSiteNode = isItemSiteNode;
  readonly isCraftingSiteNode = isCraftingSiteNode;
  protected readonly isExtractingSiteNode = isExtractingSiteNode;

  constructor(
    protected readonly extractingSiteConfig: ExtractingSiteService
  ) {
  }
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
    }
  }

  getNodeIcon(node: GraphNode): string | undefined {
    if (node instanceof ItemSiteNodeImpl || isExtractionNode(node)) return node.factorySiteTarget.icon.link;
    if (node instanceof CraftingSiteNodeImpl) return node.automaton.descriptor.icon.link
    if (node instanceof ExtractingSiteNodeImpl) return node.automaton.descriptor.icon.link
    return undefined
  }

  getNodeTooltip(node: GraphNode): string | undefined {
    if (node instanceof ItemSiteNodeImpl) return node.factorySiteTarget.displayName;
    if (node instanceof CraftingSiteNodeImpl) return node.automaton.displayName
    if (node instanceof ExtractingSiteNodeImpl) return node.automaton.displayName

    return undefined
  }

  onExtractingSiteClicked(node: ExtractingSiteNodeImpl) {
    const target = this.graphSubject.value?.getOutgoingEdge(node) || []
    /*    const total = sum(target.map(e => e.totalOutputPerMinute))

        this.graphSubject.value?.nodes?.push(...res.map((extractionNode, index) => {
        }))

     */
  }

  protected readonly Purity = Purity;

  addExtractingSiteNode(purity: Purity, extractingSite: ExtractingSiteNodeImpl) {
    const id = `${extractingSite.id}-${randomString(32)}`

    this.graphSubject.value?.edges?.push({
      source: id,
      target: extractingSite.id
    })

    this.graphSubject.value?.nodes?.push({
      id,
      label: `${extractingSite.factorySiteTarget.displayName} - ${purity}`,
      overclockProfile: 100,
      purity: purity,
      factorySiteTarget: extractingSite.factorySiteTarget,
      type: FactoryNode.TypeEnum.ExtractionNode
    });
    this.graphSubject.value?.actualizeGraph()
  }

  protected readonly isExtractionNode = isExtractionNode;

  getNodeHeight(node: GraphNode): number {
    if (isExtractionNode(node)) {
      return 200
    }

    return 100
  }

  getNodeWidth(node: any): number {
    return 250
  }
}
