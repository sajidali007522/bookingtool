import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AuthGuard} from "../_helpers/auth.guard";
import {AuthGuardService} from "../_services/auth-guard.service";
import {ManagerComponent} from "./manager/manager.component";

const environment = 'local';
export const routes: Routes = [
  { path: ':report_manager', component:ManagerComponent, canActivate: [(environment == 'local' ? AuthGuard: AuthGuardService)]  }, // default route of the module

]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
