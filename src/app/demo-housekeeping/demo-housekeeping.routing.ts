import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {HousekeepingComponent} from "./components/housekeeping/housekeeping.component";

export const routes: Routes = [
  { path: '', component: HousekeepingComponent },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
