import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAssemblyGoalComponent } from './space-assembly-goal.component';

describe('SpaceAssemblyGoalComponent', () => {
  let component: SpaceAssemblyGoalComponent;
  let fixture: ComponentFixture<SpaceAssemblyGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceAssemblyGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceAssemblyGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
