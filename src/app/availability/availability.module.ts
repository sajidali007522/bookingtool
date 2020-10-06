import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';

import * as Hammer from 'hammerjs';
import { AvailabilityComponent } from './components/availability/availability.component';
import {FormsModule} from "@angular/forms";
import {routing} from "./availability.routing";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { RoomsComponent } from './components/rooms/rooms.component';
import { TravelComponent } from './components/travel/travel.component';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
    pinch: { enable: false },
    rotate: { enable: false }
  }
}

@NgModule({
  declarations: [AvailabilityComponent, RoomsComponent, TravelComponent],
    imports: [
      CommonModule,
      FormsModule,
      routing,
      BsDatepickerModule.forRoot(),
      SharedModuleModule,
      HammerModule
    ],
    providers: [
      { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig},
    ]
})
export class AvailabilityModule { }
