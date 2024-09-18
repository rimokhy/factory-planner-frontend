import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDescriptorPickerComponent } from './item-descriptor-picker.component';

describe('ItemDescriptorPickerComponent', () => {
  let component: ItemDescriptorPickerComponent;
  let fixture: ComponentFixture<ItemDescriptorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDescriptorPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDescriptorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
