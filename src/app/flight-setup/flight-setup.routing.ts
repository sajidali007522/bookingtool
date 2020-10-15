import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AuthGuard} from "../_helpers/auth.guard";
import {FlightsComponent} from "./components/flights/flights.component";


export const routes: Routes = [
  { path: '', component: FlightsComponent, canActivate:[AuthGuard]  }, // default route of the module
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
