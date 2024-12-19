import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryListViewComponent } from './factory-list-view.component';

describe('FactoryListViewComponent', () => {
  let component: FactoryListViewComponent;
  let fixture: ComponentFixture<FactoryListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
