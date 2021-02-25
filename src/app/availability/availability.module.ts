import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import * as Hammer from 'hammerjs';
import { AvailabilityComponent } from './components/availability/availability.component';
import {FormsModule} from "@angular/forms";
import {routing} from "./availability.routing";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { RoomsComponent } from './components/rooms/rooms.component';
import { TravelComponent } from './components/travel/travel.component';
import {PopoverModule} from "ngx-bootstrap/popover";

@NgModule({
  declarations: [AvailabilityComponent, RoomsComponent, TravelComponent],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    BsDatepickerModule.forRoot(),
    SharedModuleModule,
    PopoverModule.forRoot()
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]
})
export class AvailabilityModule { }
