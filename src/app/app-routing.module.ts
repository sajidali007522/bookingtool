import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core'

//import { HomeComponent } from './components/home/home.component';
//import {LoginComponent} from "./authentication/login/login.component";
import {LoginComponent} from "./auth/login/login.component";
//import {RegisterComponent} from "./authentication/register/register.component";
//import {ReservationComponent} from "./reservation/components/reservation/reservation.component";
//import {ResultListComponent} from "./reservation/components/result-list/result-list.component";
//import {HomeLayoutComponent} from "./components/home-layout/home-layout.component";
//import {AvailabilityComponent} from "./availability/components/availability/availability.component";
//import {LoginLayoutComponent} from "./layouts/login/login-layout.component";
import {SingleColumnLayoutComponent} from "./layouts/single-column-layout/single-column-layout.component";
//import {AuthGuard} from "./_helpers/auth.guard";
import {CallbackComponent} from "./callback/callback.component";
//import {ServerLoginTestComponent} from "./server-login-test/server-login-test.component";
import {AuthGuardService} from "./_services/auth-guard.service";
import {LogoutComponent} from "./auth/logout/logout.component";

const routes: Routes = [
  {
    path: 'reservation', redirectTo: 'housekeeping', pathMatch: 'full'
    //component: SingleColumnLayoutComponent,
    //canActivate: [AuthGuardService],
    //loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule)
  },
  // {
  //   path: 'house-keeping',
  //   component: HomeLayoutComponent,
  //   canActivate: [AuthGuard],
  //   // children: [
  //   //   { path: '', component: HouseKeepingComponent },
  //   //   { path: 'search-room', component: RoomComponent },
  //   // ],
  //   loadChildren: () => import('./house-keeping/house-keeping.module').then(m => m.HouseKeepingModule)
  // },
  /*{
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'callback', component: CallbackComponent },
      { path: 'server-login', component: ServerLoginTestComponent },
      { path: 'login', component: LoginComponent, canActivate: [AuthGuardService]},
      { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService]}
    ],
  },*/
  { path: '', redirectTo: 'housekeeping', pathMatch: 'full' },
  { path: 'home', redirectTo: 'housekeeping', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService]},
  { path: 'callback', component: CallbackComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService]},

  /*{
    path: 'auth',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
    //loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },*/
  {
    path: 'availability', redirectTo: 'housekeeping', pathMatch: 'full'
    //component: SingleColumnLayoutComponent,
    //canActivate: [AuthGuardService],
    //loadChildren: () => import('./availability/availability.module').then(m => m.AvailabilityModule)
  },
  {
    path: 'housekeeping',
    component: SingleColumnLayoutComponent,
    canActivate: [AuthGuardService],

    loadChildren: () => import('./demo-housekeeping/demo-housekeeping.module').then(m => m.DemoHousekeepingModule)
  },
  {
    path: 'manage/reservation', redirectTo: 'housekeeping', pathMatch: 'full'
    //component: SingleColumnLayoutComponent,
    //canActivate: [AuthGuardService],

    //loadChildren: () => import('./demo-manage-reservation/demo-manage-reservation.module').then(m => m.DemoManageReservationModule)
  },
  {
    path: 'flight-setup', redirectTo: 'housekeeping', pathMatch: 'full'
    //canActivate: [AuthGuardService],
    //component: SingleColumnLayoutComponent,
    //loadChildren: () => import('./flight-setup/flight-setup.module').then(m => m.FlightSetupModule)
  },
  {
    path: 'user', redirectTo: 'housekeeping', pathMatch: 'full'
    //canActivate: [AuthGuardService],
    //component: SingleColumnLayoutComponent,
    //loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule{ }
