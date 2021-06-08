import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import {AuthGuard} from "../_helpers/auth.guard";
import {ResultListComponent} from "./components/result-list/result-list.component";
import {ReservationComponent} from "./components/reservation/reservation.component";
import {ReservationNewComponent} from "./components/reservation-new/reservation-new.component";
import {BusinessProfileComponent} from "./components/business-profile/business-profile.component";
import {BookProfileComponent} from "./components/book-profile/book-profile.component";
import {BookingComponent} from "./components/booking/booking.component";
import {ManageReservationComponent} from "./components/manage-reservation/manage-reservation.component";
import {AuthGuardService} from "../_services/auth-guard.service";


export const routes: Routes = [
  { path: '', component:ReservationNewComponent, canActivate: [AuthGuardService]  }, // default route of the module
  { path: 'old', component:ReservationComponent, canActivate: [AuthGuardService]  }, // default route of the module
  { path: 'manage', component:ManageReservationComponent, canActivate: [AuthGuardService]  }, // default route of the module
  { path: ":booking_id/search/:resource_typeid/:session_id", component:ResultListComponent, canActivate: [AuthGuardService] },
  { path: ":booking_id/business-profile/:session_id", component:BusinessProfileComponent, canActivate: [AuthGuardService] },
  { path: ":booking_id/booking/:session_id", component:BookingComponent, canActivate: [AuthGuardService] },
  { path: ":booking_id/book-profile", component:BookProfileComponent, canActivate: [AuthGuardService] },
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
