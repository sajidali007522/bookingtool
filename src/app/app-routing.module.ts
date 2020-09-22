import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from "./_helpers/auth.guard";
import {MainComponent} from "./components/main/main.component";
import {SingleColumnLayoutComponent} from "./layouts/single-column-layout/single-column-layout.component";
import {LoginComponent} from "./authentication/login/login.component";
import {RegisterComponent} from "./authentication/register/register.component";
import {HouseKeepingComponent} from "./house-keeping/components/house-keeping/house-keeping.component";
import {RoomComponent} from "./house-keeping/components/room/room.component";
import {HomeLayoutComponent} from "./components/home-layout/home-layout.component";

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
    //loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'house-keeping',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HouseKeepingComponent },
      { path: 'search-room', component: RoomComponent },
    ],
    loadChildren: () => import('./house-keeping/house-keeping.module').then(m => m.HouseKeepingModule)
  },
  {
    path: '',
    component: HomeLayoutComponent,
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
export class AppRoutingModule {}
