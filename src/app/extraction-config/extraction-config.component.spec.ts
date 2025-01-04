import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionConfigComponent } from './extraction-config.component';

describe('ExtractionConfigComponent', () => {
  let component: ExtractionConfigComponent;
  let fixture: ComponentFixture<ExtractionConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractionConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtractionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
