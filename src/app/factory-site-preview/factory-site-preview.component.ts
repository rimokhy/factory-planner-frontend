import {AfterContentInit, AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, lastValueFrom, Subject, take} from "rxjs";
import {
  FactoryRequirementsComponent,
  isExtractor,
  isRecipe,
  QueryParamRequirement,
  QueryParamSuppliedItem
} from "../factory-requirements/factory-requirements.component";
import {GraphNavigator, GraphNode} from "../factory-requirements/graph/graph-navigator";
import {FactoryGraphComponent} from "../factory-graph/factory-graph.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatGridListModule} from "@angular/material/grid-list";
import {FactoryListViewComponent} from "../factory-list-view/factory-list-view.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {FactoryPlannerControllerService} from "../factory-planner-api";
import {isEqual, isNil} from "lodash";
import {FactorySuppliesComponent} from "../factory-supplies/factory-supplies.component";
import {makeFactorySiteRequest} from "../factory-requirements/item-site.request";
import {isExtractionNode, isItemSiteNode} from "../factory-requirements/graph/node.factory";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ExtractionConfigComponent, QueryParamExtractionNode} from "../extraction-config/extraction-config.component";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-factory-site-preview',
  standalone: true,
  imports: [
    FactoryRequirementsComponent,
    FactoryGraphComponent,
    MatTabGroup,
    MatTab,
    NgIf,
    AsyncPipe,
    MatGridListModule,
    FactoryListViewComponent,
    MatIconModule,
    MatButtonModule,
    FactorySuppliesComponent,
    MatTooltipModule,
    ExtractionConfigComponent
  ],
  templateUrl: './factory-site-preview.component.html',
  styleUrl: './factory-site-preview.component.scss'
})
export class FactorySitePreviewComponent implements OnInit, AfterContentInit, AfterViewInit {
  updateGraphSubject: Subject<boolean> = new Subject<boolean>();
  graphSubject: BehaviorSubject<GraphNavigator | null> = new BehaviorSubject<GraphNavigator | null>(null)
  @ViewChild(FactoryRequirementsComponent) requirements!: FactoryRequirementsComponent;
  @ViewChild(FactorySuppliesComponent) suppliesComponent!: FactorySuppliesComponent;
  @ViewChild(ExtractionConfigComponent) extractionComponent!: ExtractionConfigComponent;
  private graphCreating = false
  private snackBar = inject(MatSnackBar);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly factoryPlannerControllerService: FactoryPlannerControllerService,
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

  ngAfterViewInit() {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe(async params => {
      if (this.requirements?.isFilled() === true) {
        return
      }


      await this.requirements.loadFactoryRequirement(params.getAll('factoryRequirement').map(e => JSON.parse(e) as QueryParamRequirement))
      await this.suppliesComponent.loadSuppliedItems(params.getAll('suppliedItem').map(e => JSON.parse(e) as QueryParamSuppliedItem))


      await this.reload(true)

      this.extractionComponent.loadExtractionNode(params.getAll('extractionConfig').map(e => JSON.parse(e) as QueryParamExtractionNode))
    })

  }

  ngAfterContentInit(): void {
    this.graphSubject = new BehaviorSubject<GraphNavigator | null>(null)
    this.updateGraphSubject = new Subject()
  }


  async reloadGraph(): Promise<GraphNavigator | null> {
    const sealed = this.requirements.getSealedRequirements()
    const existing = this.graphSubject?.value?.requirements

    if (!this.graphCreating && !isEqual(sealed, existing)) {
      this.graphCreating = true
      const oldExtractionConfig = this.extractionComponent.sealed()
      console.log('old extraction config', oldExtractionConfig)
      const newGraph = new GraphNavigator(sealed, this.suppliesComponent.getSealedSuppliedItems(), this.updateGraphSubject)
      const graphRequest = sealed.map(e => makeFactorySiteRequest(e))
      const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(graphRequest))

      newGraph.populate(graphResponse)


      this.graphSubject.next(newGraph)
      this.extractionComponent.loadExtractionNode(oldExtractionConfig)

      this.updateGraphSubject.next(true)
      this.graphCreating = false

      // Autoloading of requirement / extraction node in side panel
      /*
      newGraph.nodes.filter(e => {
        const edges = newGraph.getIncomingEdges(e)

        return (e instanceof ItemSiteNodeImpl || e instanceof ExtractingSiteNodeImpl) && isEmpty(edges);
      }).forEach(e => this.nodeClicked(e))

       */
      return newGraph
    }
    this.updateQueryParams()

    return null
  }


  actualizeGraph() {
    if (!this.requirements) throw new Error('no req, called too soon ?')

    const req = this.requirements.getSealedRequirements()
    const supplied = this.suppliesComponent.getSealedSuppliedItems()

    this.graphSubject.value?.actualizeGraph(req, supplied)
    this.updateQueryParams()

  }

  async reload(fullReload: boolean) {
    if (fullReload) {
      await this.reloadGraph()
    } else {
      this.actualizeGraph()
    }

  }

  saveSite() {
    const graph = this.graphSubject.value

    if (isNil(graph)) {
      this.snackBar.open('Cannot save without graph');
      return
    }
    const hasNodeBalanceBelowZero = graph.nodes.some(e => graph.getBalance(e) < 0 && !isExtractionNode(e))

    if (hasNodeBalanceBelowZero) {
      this.snackBar.open('Some nodes have balance below 0');
      return
    }
    // TODO confirm
  }

  nodeClicked(nodeClicked: GraphNode) {
    const graph = this.graphSubject.value

    if (isNil(graph)) {
      return
    }
    //  && this.requirements.getSealedRequirements().every(e => e.item.className !== nodeClicked.factorySiteTarget.className)
    if (isItemSiteNode(nodeClicked)) {
      this.requirements.addFactoryRequirement(nodeClicked.factorySiteTarget)
      this.reload(true)
    }

  }

  private updateQueryParams() {
    const factoryRequirement = this.getQueryParamRequirements()
    const sealedSupplied = this.suppliesComponent.getSealedSuppliedItems().map(e => ({
      ...e,
      itemClass: e.item.className,
      item: undefined,
    }))

    const extractingNodes = this.extractionComponent.sealed()

    console.log('update', extractingNodes)

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        factoryRequirement: factoryRequirement.map(e => JSON.stringify(e)),
        suppliedItem: sealedSupplied.map(e => JSON.stringify(e)),
        extractionConfig: extractingNodes.map(e => JSON.stringify(e))
      },
      queryParamsHandling: 'merge',
    });
  }

  private getQueryParamRequirements(): QueryParamRequirement[] {
    if (!this.requirements) throw new Error('no req, called too soon ?')

    const sealedReq = this.requirements.getSealedRequirements()

    return sealedReq.map(({item, manufacturing, requiredAmount}) => {
      const recipeClass = isRecipe(manufacturing) ? manufacturing.className : undefined
      const extractorClass = isExtractor(manufacturing) ? manufacturing.className : undefined

      return ({
        itemClass: item.className,
        requiredAmount: requiredAmount,
        recipeClass,
        extractorClass
      });
    })
  }
}
