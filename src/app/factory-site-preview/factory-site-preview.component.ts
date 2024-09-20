import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {lastValueFrom, Observable, Subject} from "rxjs";
import {FactoryPlannerControllerService, FactoryPlanningRequest} from "../factory-planner-api";
import {Edge, NgxGraphModule, Node} from "@swimlane/ngx-graph";
import {AsyncPipe, NgIf} from "@angular/common";

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

@Component({
  selector: 'app-factory-site-preview',
  standalone: true,
  imports: [
    NgxGraphModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './factory-site-preview.component.html',
  styleUrl: './factory-site-preview.component.scss'
})
export class FactorySitePreviewComponent implements OnChanges {
  @Input() factorySiteInput!: FactoryPlanningRequest
  graphSubject = new Subject<Graph>()


  constructor(private readonly factoryPlannerService: FactoryPlannerControllerService) {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const site = changes['graphSubject'].currentValue as FactoryPlanningRequest;
    if (!site) {
      return
    }
    const factorySite = await lastValueFrom(this.factoryPlannerService.factoryPlanning(site))

    this.graphSubject.next({
      nodes: factorySite.nodes.map(node => ({
        id: node.id,
        label: node.label
      })),
      edges: factorySite.edges
    })
  }
}
