import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorySuppliesComponent } from './factory-supplies.component';

describe('FactorySuppliesComponent', () => {
  let component: FactorySuppliesComponent;
  let fixture: ComponentFixture<FactorySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactorySuppliesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactorySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
