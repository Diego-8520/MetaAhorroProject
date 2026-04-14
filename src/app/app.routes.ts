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
    path: 'ahorros',
    component: AhorroPageComponent,
  },

  //Cualquier ruta que Angular no reconozca → envíala a /dashboard
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
