import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

import {routing} from "./demo-housekeeping.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { HousekeepingComponent } from './components/housekeeping/housekeeping.component';
import { RoomImageComponent } from './components/room-image/room-image.component';
import {RoomComponent} from "./components/room/room.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {ConfirmModalComponent} from "../shared/confirm-modal/confirm-modal.component";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { PopoverModule } from 'ngx-bootstrap/popover';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
    pinch: { enable: false },
    rotate: { enable: false },
  };
}
@NgModule({
  declarations: [
    HousekeepingComponent,
    RoomImageComponent,
    RoomComponent
  ],
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AutocompleteLibModule,
    SharedModuleModule,
    NgxBootstrapMultiselectModule,
    PopoverModule.forRoot()
  ]
})
export class DemoHousekeepingModule { }
