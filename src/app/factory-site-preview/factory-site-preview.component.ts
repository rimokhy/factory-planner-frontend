import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {GraphNavigator} from "../factory-requirements/graph/graph-navigator";
import {FactoryGraphComponent} from "../factory-graph/factory-graph.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatGridListModule} from "@angular/material/grid-list";
import {FactoryListViewComponent} from "../factory-list-view/factory-list-view.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


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
export class FactorySitePreviewComponent implements AfterContentInit {
  updateGraphSubject!: Subject<boolean>;
  graphSubject!: BehaviorSubject<GraphNavigator | null>
  @ViewChild(FactoryRequirementsComponent) requirements?: FactoryRequirementsComponent;

  ngAfterContentInit(): void {
    this.graphSubject = new BehaviorSubject<GraphNavigator | null>(null)
    this.updateGraphSubject = new Subject()
  }

  saveSite() {
    // is valid ?

  }
}
