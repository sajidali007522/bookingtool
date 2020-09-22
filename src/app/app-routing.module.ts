import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

import { HomeComponent } from './components/home/home.component';
import {LoginComponent} from "./authentication/login/login.component";
import {RegisterComponent} from "./authentication/register/register.component";
import {HouseKeepingComponent} from "./house-keeping/components/house-keeping/house-keeping.component";
import {RoomComponent} from "./house-keeping/components/room/room.component";
import {HomeLayoutComponent} from "./components/home-layout/home-layout.component";
import {LoginLayoutComponent} from "./layouts/login/login-layout.component";
import {AuthGuard} from "./_helpers/auth.guard";

const routes: Routes = [
  {
    path: 'house-keeping',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    // children: [
    //   { path: '', component: HouseKeepingComponent },
    //   { path: 'search-room', component: RoomComponent },
    // ],
    loadChildren: () => import('./house-keeping/house-keeping.module').then(m => m.HouseKeepingModule)
  },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
    ],
  },
  {
    path: 'auth',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
    //loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
