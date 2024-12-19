import {Component, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {GraphNavigator} from "../factory-requirements/graph/graph-navigator";
import {MatExpansionModule} from "@angular/material/expansion";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-factory-list-view',
  standalone: true,
  imports: [MatExpansionModule, AsyncPipe],
  templateUrl: './factory-list-view.component.html',
  styleUrl: './factory-list-view.component.scss'
})
export class FactoryListViewComponent {
  @Input() graphSubject!: BehaviorSubject<GraphNavigator | null>

}
