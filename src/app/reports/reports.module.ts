import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { HousekeepingComponent } from './housekeeping/housekeeping.component';
import {routing} from "./reports.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { ManagerComponent } from './manager/manager.component';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TimepickerModule} from "ngx-bootstrap/timepicker";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [HousekeepingComponent, ManagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    SharedModuleModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AutocompleteLibModule,
    NgxExtendedPdfViewerModule
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]

})
export class ReportsModule { }
