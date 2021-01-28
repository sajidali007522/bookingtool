import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AuthGuard} from "../_helpers/auth.guard";
import {ResultListComponent} from "./components/result-list/result-list.component";
import {ReservationComponent} from "./components/reservation/reservation.component";
import {ReservationNewComponent} from "./components/reservation-new/reservation-new.component";
import {BusinessProfileComponent} from "./components/business-profile/business-profile.component";


export const routes: Routes = [
  { path: '', component:ReservationNewComponent, canActivate: [AuthGuard]  }, // default route of the module
  { path: 'old', component:ReservationComponent, canActivate: [AuthGuard]  }, // default route of the module
  { path: ":booking_id/search/:search_id", component:ResultListComponent, canActivate: [AuthGuard] },
  { path: ":booking_id/business-profile", component:BusinessProfileComponent, canActivate: [AuthGuard] },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
