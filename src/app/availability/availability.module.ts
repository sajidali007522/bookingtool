import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityComponent } from './components/availability/availability.component';
import {FormsModule} from "@angular/forms";
import {routing} from "./availability.routing";

@NgModule({
  declarations: [AvailabilityComponent],
  imports: [
    CommonModule,
    FormsModule,
    routing
  ]
})
export class AvailabilityModule { }
