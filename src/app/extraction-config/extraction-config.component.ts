import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExtractingSiteNodeImpl} from "../factory-graph/graph/extracting-site.node";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {BehaviorSubject, filter, Subject, take} from "rxjs";
import {GraphNavigator} from "../factory-graph/graph/graph-navigator";
import {ExtractingNode, FactoryNode} from "../factory-planner-api";
import {MatSelectModule} from "@angular/material/select";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {isNil, remove} from "lodash";
import {Edge, Node} from "@swimlane/ngx-graph";
import {CdkListbox} from "@angular/cdk/listbox";

function randomString(len: number) {
  const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
}

export enum Purity {
  Impure = 'Impure',
  Normal = 'Normal',
  Pure = 'Pure'
}

export const PurityModifier: Record<Purity, number> = {
  [Purity.Impure]: 0.5,
  [Purity.Normal]: 1,
  [Purity.Pure]: 2
}

export interface ExtractionNode {
  purity: Purity
  overclock: number,
}

export type QueryParamExtractionNode = ExtractingNode & { siteId: string }

@Component({
  selector: 'app-extraction-config',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenuModule,
    MatDividerModule,
    CdkListbox
  ],
  templateUrl: './extraction-config.component.html',
  styleUrl: './extraction-config.component.scss'
})
export class ExtractionConfigComponent {
  @Input() graphSubject!: BehaviorSubject<GraphNavigator | null>
  @Input() updateGraphSubject!: Subject<boolean>
  @Output() configChanged: EventEmitter<boolean> = new EventEmitter<boolean>()


  get extractingSites(): ExtractingSiteNodeImpl[] {
    const graphNodes = this.graphSubject.value?.nodes || []
    const extractingSites = graphNodes.filter(node => node instanceof ExtractingSiteNodeImpl)

    return extractingSites as ExtractingSiteNodeImpl[]
  }

  getExtractingNodes(site: ExtractingSiteNodeImpl): (ExtractionNode & Node)[] {
    const extractingEdges = this.graphSubject.value?.getIncomingEdges(site) || []
    const graphNodes = this.graphSubject.value?.nodes || []

    return graphNodes.filter(e => extractingEdges.some(edge => edge.source === e.id)) as (ExtractionNode & Node)[]
  }

  addExtractingSiteNode(purity: Purity, extractingSite: ExtractingSiteNodeImpl, overclockingProfile: number = 100) {
    const id = `${extractingSite.id}-${randomString(32)}`

    this.graphSubject.value?.edges?.push({
      source: id,
      target: extractingSite.id
    })

    const node = {
      id,
      label: `${extractingSite.factorySiteTarget.displayName} - ${purity}`,
      overclock: overclockingProfile,
      purity: purity,
      factorySiteTarget: extractingSite.factorySiteTarget,
      type: FactoryNode.TypeEnum.ExtractionNode
    }
    this.graphSubject.value?.nodes?.push(node);
    this.graphSubject.value?.actualizeGraph()
    this.configChanged.emit(false)
  }

  loadExtractionNode(config: QueryParamExtractionNode[]) {
    this.graphSubject.pipe(take(1), filter(e => !isNil(e))).subscribe(graph => {
      config.forEach(extractionNode => {
        const site = graph.nodes.find(e => extractionNode.siteId === e.id) as ExtractingSiteNodeImpl

        if (isNil(site)) {
          return
        }

        this.addExtractingSiteNode(extractionNode.purity as Purity, site, extractionNode.overclock)
      })
    })
  }

  sealed(): QueryParamExtractionNode[] {
    return this.extractingSites.map(site => {
      return this.getExtractingNodes(site).map(e => ({
        purity: e.purity,
        overclock: e.overclock,
        siteId: site.id
      } as QueryParamExtractionNode))
    }).flat()
  }

  get purityOptions(): Purity[] {
    return Object.keys(Purity) as unknown as Purity[]
  }

  removeNode(node: (ExtractionNode & Node), siteId: string) {
    const graph = this.graphSubject.value

    if (isNil(graph)) {
      return
    }
    remove(graph.nodes, (e) => e.id === node.id)
    remove(graph.edges, (e) => e.source === node.id && e.target === siteId)
    this.configChanged.emit(true)
  }
}
