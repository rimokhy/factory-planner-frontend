import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipePickerComponent } from './recipe-picker.component';
import {appConfig} from "../app.config";
import {BehaviorSubject} from "rxjs";
import {ExtractorDto, ItemDescriptorDto, RecipeDto} from "../factory-planner-api";

describe('RecipePickerComponent', () => {
  let component: RecipePickerComponent;
  let fixture: ComponentFixture<RecipePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],
      imports: [RecipePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipePickerComponent);
    component = fixture.componentInstance;
    component.itemSelected = new BehaviorSubject<ItemDescriptorDto | null>(null);
    component.recipeSelected = new BehaviorSubject<RecipeDto | ExtractorDto | null>(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
