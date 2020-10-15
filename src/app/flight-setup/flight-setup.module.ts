import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsComponent } from './components/flights/flights.component';
import {routing} from "./flight-setup.routing";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [FlightsComponent],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    BsDatepickerModule.forRoot(),
  ]
})
export class FlightSetupModule { }
