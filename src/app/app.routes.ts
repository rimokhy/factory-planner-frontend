import {Routes} from '@angular/router';
import {FactoryPlannerComponent} from "./factory-planner/factory-planner.component";
import {FactorySitePreviewComponent} from "./factory-site-preview/factory-site-preview.component";

export const routes: Routes = [
  {
    path: 'factory-planning',
    component: FactorySitePreviewComponent
  }
];
