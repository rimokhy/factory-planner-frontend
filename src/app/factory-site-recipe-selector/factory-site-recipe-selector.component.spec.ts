import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorySiteRecipeSelectorComponent } from './factory-site-recipe-selector.component';

describe('FactorySiteRecipeSelectorComponent', () => {
  let component: FactorySiteRecipeSelectorComponent;
  let fixture: ComponentFixture<FactorySiteRecipeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactorySiteRecipeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactorySiteRecipeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
