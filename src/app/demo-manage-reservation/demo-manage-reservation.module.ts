import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import { LightboxModule } from 'ngx-lightbox';
import * as Hammer from 'hammerjs';

import {routing} from "./demo-manage-reservation.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { ManageReservationComponent } from './components/manage-reservation/manage-reservation.component';
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
    ManageReservationComponent,
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
    LightboxModule,
    PopoverModule.forRoot()
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]
})
export class DemoManageReservationModule { }
