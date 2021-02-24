import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AuthGuard} from "../_helpers/auth.guard";
import {SettingsComponent} from "./components/settings/settings.component";



export const routes: Routes = [
  { path: 'settings', component:SettingsComponent, canActivate: [AuthGuard]  }, // default route of the module

]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
