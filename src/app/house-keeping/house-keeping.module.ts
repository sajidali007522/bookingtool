import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

import {routing} from "./house-keeping.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { HouseKeepingComponent } from './components/house-keeping/house-keeping.component';
import { RoomImageComponent } from './components/room-image/room-image.component';
import {RoomComponent} from "./components/room/room.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {LoaderComponent} from "../shared/loader/loader.component";
import {ConfirmModalComponent} from "../shared/confirm-modal/confirm-modal.component";
import {AutocompleteLibModule} from "angular-ng-autocomplete";

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
    pinch: { enable: false },
    rotate: { enable: false },
  };
}

@NgModule({
  declarations: [
    HouseKeepingComponent,
    RoomImageComponent,
    RoomComponent,
    LoaderComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AutocompleteLibModule
  ]
})
export class HouseKeepingModule { }
