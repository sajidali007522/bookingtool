import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from "./_helpers/auth.guard";
import {MainComponent} from "./components/main/main.component";
import {SingleColumnLayoutComponent} from "./layouts/single-column-layout/single-column-layout.component";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'reservation',
    component: SingleColumnLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule)
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
    ],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule{ }
