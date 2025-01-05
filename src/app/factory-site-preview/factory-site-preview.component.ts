import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, filter, lastValueFrom, Subject, take} from "rxjs";
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
import {isEmpty, isEqual, isNil} from "lodash";
import {FactorySuppliesComponent} from "../factory-supplies/factory-supplies.component";
import {makeFactorySiteRequest} from "../factory-requirements/item-site.request";
import {isExtractionNode, isItemSiteNode} from "../factory-requirements/graph/node.factory";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ItemSiteNodeImpl} from "../factory-requirements/graph/item-site.node";
import {ExtractingSiteNodeImpl} from "../factory-requirements/graph/extracting-site.node";
import {ExtractionConfigComponent, ExtractionNode} from "../extraction-config/extraction-config.component";


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
  private graphCreating = false



  @ViewChild(FactoryRequirementsComponent) requirements!: FactoryRequirementsComponent;
  @ViewChild(FactorySuppliesComponent) suppliesComponent!: FactorySuppliesComponent;
  @ViewChild(ExtractionConfigComponent) extractionComponent!: ExtractionConfigComponent;

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

      const config = params.getAll('extractionConfig').map(e => JSON.parse(e) as ExtractionNode & { siteId: string })


      this.graphSubject.pipe(take(1), filter(e => !isNil(e))).subscribe(graph => {
        console.log('piped to here', config)
        config.forEach(extractionNode => {
          const site = graph.nodes.find(e => extractionNode.siteId === e.id) as ExtractingSiteNodeImpl

          if (isNil(site)) {
            return
          }

          this.extractionComponent.addExtractingSiteNode(extractionNode.purity, site, extractionNode.overclockProfile)
        })
      })
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
      const newGraph = new GraphNavigator(sealed, this.suppliesComponent.getSealedSuppliedItems(), this.updateGraphSubject)
      const graphRequest = sealed.map(e => makeFactorySiteRequest(e))
      const graphResponse = await lastValueFrom(this.factoryPlannerControllerService.planFactorySite(graphRequest))

      newGraph.populate(graphResponse)


      this.graphSubject.next(newGraph)
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
    return null
  }


  actualizeGraph() {
    if (!this.requirements) throw new Error('no req, called too soon ?')

    const req = this.requirements.getSealedRequirements()
    const supplied = this.suppliesComponent.getSealedSuppliedItems()

    this.graphSubject.value?.actualizeGraph(req, supplied)
  }

  async reload(fullReload: boolean) {
    if (fullReload) {
      await this.reloadGraph()
    } else {
      this.actualizeGraph()
    }

    this.updateQueryParams()
  }

  private updateQueryParams() {
    const factoryRequirement = this.getQueryParamRequirements()
    const sealedSupplied = this.suppliesComponent.getSealedSuppliedItems().map(e => ({
      ...e,
      itemClass: e.item.className,
      item: undefined,
    }))

    const nodes = this.graphSubject.value?.nodes || []
    const extractingSites = nodes.filter(e => e instanceof ExtractingSiteNodeImpl) as ExtractingSiteNodeImpl[]
    const extractingNodes = extractingSites.map(site => {
      return this.extractionComponent.getExtractingNodes(site).map(e => ({
        purity: e.purity,
        overclock: e.overclockProfile,
        siteId: site.id
      }))
    }).flat()


    console.log('extractingNodes update param', extractingNodes)
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


  saveSite() {
    // is valid ?

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
}
