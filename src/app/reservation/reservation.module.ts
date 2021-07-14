import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ReservationComponent} from "./components/reservation/reservation.component";
import {ResultListComponent} from "./components/result-list/result-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {routing} from "./reservation.routing";
import {Ng5SliderModule} from "ng5-slider";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TimepickerModule} from "ngx-bootstrap/timepicker";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { ReservationNewComponent } from './components/reservation-new/reservation-new.component';
import {BusinessProfileComponent} from "./components/business-profile/business-profile.component";
import {BookProfileComponent} from "./components/book-profile/book-profile.component";
import { BookingComponent } from './components/booking/booking.component';
import {ManageReservationComponent} from "./components/manage-reservation/manage-reservation.component";
import {RecordGridComponent} from "./components/record-grid/record-grid.component";
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import {SingleColumnLayoutComponent} from "../layouts/single-column-layout/single-column-layout.component";



@NgModule({
  declarations: [
    ReservationComponent,
    ResultListComponent,
    ReservationNewComponent,
    BusinessProfileComponent,
    BookProfileComponent,
    BookingComponent,
    ManageReservationComponent,
    RecordGridComponent,
    RightSidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng5SliderModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AutocompleteLibModule,
    SharedModuleModule,
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap:[SingleColumnLayoutComponent]
})
export class ReservationModule { }
