import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {HousekeepingComponent} from "./components/housekeeping/housekeeping.component";
import {AuthGuardService} from "../_services/auth-guard.service";

export const routes: Routes = [
  { path: '', component: HousekeepingComponent, canActivate: [AuthGuardService] },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
