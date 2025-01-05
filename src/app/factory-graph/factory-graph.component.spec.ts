import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryGraphComponent } from './factory-graph.component';
import {Input} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {GraphNavigator} from "./graph/graph-navigator";
import {FactoryRequirementsComponent} from "../factory-requirements/factory-requirements.component";
import {appConfig} from "../app.config";

describe('FactoryGraphComponent', () => {
  let component: FactoryGraphComponent;
  let fixture: ComponentFixture<FactoryGraphComponent>;
  let requirementComponentFixture: ComponentFixture<FactoryRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],
      imports: [FactoryGraphComponent]
    })
    .compileComponents();
    const graphSubject = new BehaviorSubject<GraphNavigator | null>(null)
    const updateGraphSubject =  new Subject<boolean>()

    fixture = TestBed.createComponent(FactoryGraphComponent);

    requirementComponentFixture = TestBed.createComponent(FactoryRequirementsComponent)
    requirementComponentFixture.componentInstance.graphSubject = graphSubject
    requirementComponentFixture.componentInstance.updateGraphSubject = updateGraphSubject

    component = fixture.componentInstance;
    component.graphSubject = graphSubject
    component.updateGraphSubject = updateGraphSubject
    component.requirements = requirementComponentFixture.componentInstance

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
