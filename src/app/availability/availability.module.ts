import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityComponent } from './components/availability/availability.component';
import {FormsModule} from "@angular/forms";
import {routing} from "./availability.routing";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {SharedModuleModule} from "../shared-module/shared-module.module";

@NgModule({
  declarations: [AvailabilityComponent],
    imports: [
        CommonModule,
        FormsModule,
        routing,
        BsDatepickerModule.forRoot(),
        SharedModuleModule
    ]
})
export class AvailabilityModule { }
