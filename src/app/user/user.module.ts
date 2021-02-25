import { NgModule } from '@angular/core';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SettingsComponent} from "./components/settings/settings.component";
import {FormsModule} from "@angular/forms";
import {routing} from './user.routing'



@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    routing,
    CommonModule
  ],
  providers:[
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]
})
export class UserModule { }
