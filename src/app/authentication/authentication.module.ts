import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {routing} from "./authentication.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class AuthenticationModule { }
