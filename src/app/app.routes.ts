import { Route } from '@angular/router';

import { DashboardComponent } from './features/crud/pages/dashboard/dashboard'; 


export const routes: Route[] = [
  
  { path: 'dashboard', component: DashboardComponent, },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
