import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AmountPickerComponent} from "../amount-picker/amount-picker.component";
import {ItemDescriptorPickerComponent} from "../item-descriptor-picker/item-descriptor-picker.component";
import {RecipePickerComponent} from "../recipe-picker/recipe-picker.component";
import {ExtractingSiteNodeImpl} from "../factory-requirements/graph/extracting-site.node";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {BehaviorSubject, Subject} from "rxjs";
import {GraphNavigator} from "../factory-requirements/graph/graph-navigator";
import {FactoryNode} from "../factory-planner-api";
import {MatSelectModule} from "@angular/material/select";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";

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
  overclockProfile: number,
}

@Component({
  selector: 'app-extraction-config',
  standalone: true,
  imports: [
    AmountPickerComponent,
    ItemDescriptorPickerComponent,
    RecipePickerComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenuModule
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

  getExtractingNodes(site: ExtractingSiteNodeImpl): ExtractionNode[] {
    const extractingEdges = this.graphSubject.value?.getIncomingEdges(site) || []
    const graphNodes = this.graphSubject.value?.nodes || []

    return graphNodes.filter(e => extractingEdges.some(edge => edge.source === e.id)) as ExtractionNode[]
  }

  loadExtractingSiteNodes(site: ExtractingSiteNodeImpl, ...nodes: ExtractionNode[]) {
    const toCreate = nodes.map(e => {
      const id = `${site.id}-${randomString(32)}`

      this.graphSubject.value?.edges?.push({
        source: id,
        target: site.id
      })

      return {
        id,
        label: `${site.factorySiteTarget.displayName} - ${e.purity}`,
        overclockProfile: e.overclockProfile,
        purity: e.purity,
        factorySiteTarget: site.factorySiteTarget,
        type: FactoryNode.TypeEnum.ExtractionNode
      }
    })

    this.graphSubject.value?.nodes?.push(...toCreate);
    this.graphSubject.value?.actualizeGraph()
    this.configChanged.emit(false)
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
      overclockProfile: overclockingProfile,
      purity: purity,
      factorySiteTarget: extractingSite.factorySiteTarget,
      type: FactoryNode.TypeEnum.ExtractionNode
    }
    this.graphSubject.value?.nodes?.push(node);
    this.graphSubject.value?.actualizeGraph()
    this.configChanged.emit(false)
  }

  get purityOptions(): Purity[] {
    return Object.keys(Purity) as unknown as Purity[]
  }
}
