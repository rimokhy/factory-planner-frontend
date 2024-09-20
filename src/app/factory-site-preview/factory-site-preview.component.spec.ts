import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorySitePreviewComponent } from './factory-site-preview.component';

describe('FactorySitePreviewComponent', () => {
  let component: FactorySitePreviewComponent;
  let fixture: ComponentFixture<FactorySitePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactorySitePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactorySitePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
