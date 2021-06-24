import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { HousekeepingComponent } from './housekeeping/housekeeping.component';
import {routing} from "./reports.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import { ManagerComponent } from './manager/manager.component';


@NgModule({
  declarations: [HousekeepingComponent, ManagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    SharedModuleModule,
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]

})
export class ReportsModule { }
