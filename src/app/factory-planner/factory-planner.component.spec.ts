import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryPlannerComponent } from './factory-planner.component';
import {appConfig} from "../app.config";

describe('FactoryPlannerComponent', () => {
  let component: FactoryPlannerComponent;
  let fixture: ComponentFixture<FactoryPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],
      imports: [FactoryPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
