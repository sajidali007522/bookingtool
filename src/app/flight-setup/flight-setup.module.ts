import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsComponent } from './components/flights/flights.component';
import {routing} from "./flight-setup.routing";



@NgModule({
  declarations: [FlightsComponent],
  imports: [
    CommonModule,
    routing
  ]
})
export class FlightSetupModule { }
