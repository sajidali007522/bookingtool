import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {AlertModalComponent} from "../shared/alert-modal/alert-modal.component";



@NgModule({
  declarations: [LoaderComponent, AlertModalComponent],
  imports: [
    CommonModule
  ],
  exports:[
    LoaderComponent, AlertModalComponent
  ]
})
export class SharedModuleModule { }
