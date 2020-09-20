import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReservationComponent} from "./components/reservation/reservation.component";
import {ResultListComponent} from "./components/result-list/result-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {routing} from "./reservation.routing";
import {Ng5SliderModule} from "ng5-slider";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TimepickerModule} from "ngx-bootstrap/timepicker";
import {LoaderComponent} from "../shared/loader/loader.component";
import {AutocompleteLibModule} from "angular-ng-autocomplete";



@NgModule({
  declarations: [
    ReservationComponent,
    ResultListComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng5SliderModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AutocompleteLibModule
  ]
})
export class ReservationModule { }
