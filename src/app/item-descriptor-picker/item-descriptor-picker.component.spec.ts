import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDescriptorPickerComponent } from './item-descriptor-picker.component';
import {appConfig} from "../app.config";
import {BehaviorSubject} from "rxjs";
import {ExtractorDto, ItemDescriptorDto, RecipeDto} from "../factory-planner-api";

describe('ItemDescriptorPickerComponent', () => {
  let component: ItemDescriptorPickerComponent;
  let fixture: ComponentFixture<ItemDescriptorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],

      imports: [ItemDescriptorPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDescriptorPickerComponent);
    component = fixture.componentInstance;
    component.amountSelected = new BehaviorSubject<number>(0);
    component.itemSelected = new BehaviorSubject<ItemDescriptorDto | null>(null);
    component.recipeSelected = new BehaviorSubject<RecipeDto | ExtractorDto | null>(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
