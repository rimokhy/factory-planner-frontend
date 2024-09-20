import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryComposerComponent } from './factory-composer.component';

describe('FactoryComposerComponent', () => {
  let component: FactoryComposerComponent;
  let fixture: ComponentFixture<FactoryComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryComposerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
