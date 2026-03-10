import { Routes } from '@angular/router';
import { AhorroPageComponent } from './features/ahorro/pages/ahorro-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'ahorro',
    component: AhorroPageComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
