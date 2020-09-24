import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AvailabilityComponent} from "./components/availability/availability.component";
import {AuthGuard} from "../_helpers/auth.guard";


export const routes: Routes = [
  { path: '', component: AvailabilityComponent, canActivate:[AuthGuard]  }, // default route of the module
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
