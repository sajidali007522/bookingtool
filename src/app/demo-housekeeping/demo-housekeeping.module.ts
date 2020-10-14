import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousekeepingComponent } from './components/housekeeping/housekeeping.component';
import {routing} from "./demo-housekeeping.routing";



@NgModule({
  declarations: [HousekeepingComponent],
  imports: [
    CommonModule,
    routing
  ]
})
export class DemoHousekeepingModule { }
