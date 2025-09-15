import { Route } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { DashboardComponent } from './features/crud/pages/dashboard/dashboard'; 
import { authGuard } from './core/guards/auth-guard';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ authGuard ] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
