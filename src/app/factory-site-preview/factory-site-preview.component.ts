import {Component, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {GraphNavigator} from "../factory-requirements/graph/graph-navigator";
import {FactoryGraphComponent} from "../factory-graph/factory-graph.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";


@Component({
  selector: 'app-factory-site-preview',
  standalone: true,
  imports: [
    FactoryRequirementsComponent,
    FactoryGraphComponent,
    MatTabGroup,
    MatTab,
  ],
  templateUrl: './factory-site-preview.component.html',
  styleUrl: './factory-site-preview.component.scss'
})
export class FactorySitePreviewComponent {
  updateGraphSubject: Subject<boolean> = new Subject();
  graphSubject = new BehaviorSubject<GraphNavigator | null>(null)
  @ViewChild(FactoryRequirementsComponent) requirements!: FactoryRequirementsComponent;


}
