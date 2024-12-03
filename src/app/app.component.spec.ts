import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {RecipePickerComponent} from "./recipe-picker/recipe-picker.component";
import {ItemDescriptorPickerComponent} from "./item-descriptor-picker/item-descriptor-picker.component";
import {NgIf} from "@angular/common";
import {NavComponent} from "./nav/nav.component";
import {appConfig} from "./app.config";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        // TODO should mock
        ...appConfig.providers
      ],
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
