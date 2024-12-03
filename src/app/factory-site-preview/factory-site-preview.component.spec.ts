import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorySitePreviewComponent } from './factory-site-preview.component';
import {appConfig} from "../app.config";

describe('FactorySitePreviewComponent', () => {
  let component: FactorySitePreviewComponent;
  let fixture: ComponentFixture<FactorySitePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],
      imports: [FactorySitePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactorySitePreviewComponent);
    component = fixture.componentInstance;
    console.log('wouf', component)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
