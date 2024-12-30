import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject, take} from "rxjs";
import {
  FactoryRequirementsComponent, isExtractor, isRecipe,
  QueryParamRequirement, QueryParamSuppliedItem
} from "../factory-requirements/factory-requirements.component";
import {GraphNavigator} from "../factory-requirements/graph/graph-navigator";
import {FactoryGraphComponent} from "../factory-graph/factory-graph.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatGridListModule} from "@angular/material/grid-list";
import {FactoryListViewComponent} from "../factory-list-view/factory-list-view.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {
  FactoryPlannerControllerService,
  ItemDescriptorControllerService,
  RecipeControllerService
} from "../factory-planner-api";
import {isEmpty} from "lodash";


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
  ],
  templateUrl: './factory-site-preview.component.html',
  styleUrl: './factory-site-preview.component.scss'
})
export class FactorySitePreviewComponent implements AfterContentInit, AfterViewInit {
  updateGraphSubject!: Subject<boolean>;
  graphSubject!: BehaviorSubject<GraphNavigator | null>

  @ViewChild(FactoryRequirementsComponent) requirements!: FactoryRequirementsComponent;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  ngAfterViewInit() {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe(async params => {
      console.log('??', this.requirements)

      if (this.requirements?.isFilled() === true) {
        return
      }


      await this.requirements.loadFactoryRequirement(params.getAll('factoryRequirement').map(e => JSON.parse(e) as QueryParamRequirement))
      await this.requirements?.loadSuppliedItems(params.getAll('suppliedItem').map(e => JSON.parse(e) as QueryParamSuppliedItem))

      await this.requirements?.onRequirementChanged()
    })

  }

  ngAfterContentInit(): void {
    this.graphSubject = new BehaviorSubject<GraphNavigator | null>(null)
    this.updateGraphSubject = new Subject()
  }


  requirementsUpdated() {
    const factoryRequirement = this.getQueryParamRequirements()
    const sealedSupplied = this.requirements.getSealedSuppliedItems().map(e => ({
      ...e,
      itemClass: e.item.className,
      item: undefined,
    }))

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        factoryRequirement: factoryRequirement.map(e => JSON.stringify(e)),
        suppliedItem: sealedSupplied.map(e => JSON.stringify(e)),
      },
      queryParamsHandling: 'merge',
    });
  }


  getQueryParamRequirements(): QueryParamRequirement[] {
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
}
