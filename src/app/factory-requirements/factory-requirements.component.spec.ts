import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryRequirementsComponent } from './factory-requirements.component';
import {appConfig} from "../app.config";

describe('FactoryRequirementsComponent', () => {
  let component: FactoryRequirementsComponent;
  let fixture: ComponentFixture<FactoryRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],

      imports: [FactoryRequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
