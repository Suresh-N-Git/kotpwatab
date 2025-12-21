import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { StocksComponent } from './stocks/stocks.component';
// import { NavBarComponent } from './nav-bar/nav-bar.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
//   { path: 'stocks', component: StocksComponent },
//   { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
  // Any invalid which the user tries to access through URL will be sent here.
  // Any route where the user has no rights will be handled in the app-routing.module and sent to same page
  // { path: '**', component: PageNotFoundComponent }
];

