import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { FlightsComponent } from './components/flights/flights.component';
import {routing} from "./flight-setup.routing";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {FormsModule} from "@angular/forms";
import {SingleColumnLayoutComponent} from "../layouts/single-column-layout/single-column-layout.component";


@NgModule({
  declarations: [FlightsComponent],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    BsDatepickerModule.forRoot(),
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap:[SingleColumnLayoutComponent]
})
export class FlightSetupModule { }
