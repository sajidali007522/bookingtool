import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AuthGuard} from "../_helpers/auth.guard";
import {AuthGuardService} from "../_services/auth-guard.service";
import {HousekeepingComponent} from "./housekeeping/housekeeping.component";


export const routes: Routes = [
  { path: 'housekeeping', component:HousekeepingComponent, canActivate: [AuthGuardService]  }, // default route of the module

]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
