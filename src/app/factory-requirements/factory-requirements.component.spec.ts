import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryRequirementsComponent } from './factory-requirements.component';

describe('FactoryRequirementsComponent', () => {
  let component: FactoryRequirementsComponent;
  let fixture: ComponentFixture<FactoryRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
