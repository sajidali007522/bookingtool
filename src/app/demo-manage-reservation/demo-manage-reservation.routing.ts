import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {ManageReservationComponent} from "./components/manage-reservation/manage-reservation.component";

export const routes: Routes = [
  { path: '', component: ManageReservationComponent },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
