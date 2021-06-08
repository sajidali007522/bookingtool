import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

import {SettingsComponent} from "./components/settings/settings.component";
import {AuthGuardService} from "../_services/auth-guard.service";



export const routes: Routes = [
  { path: 'settings', component:SettingsComponent, canActivate: [AuthGuardService]  }, // default route of the module

]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
