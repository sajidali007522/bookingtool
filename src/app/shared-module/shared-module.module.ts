import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {AlertModalComponent} from "../shared/alert-modal/alert-modal.component";
import {ModalComponent} from "./components/modal/modal.component";



@NgModule({

  declarations: [LoaderComponent, AlertModalComponent, ModalComponent],
  imports: [
    CommonModule
  ],
  exports:[
    LoaderComponent, AlertModalComponent, ModalComponent
  ]
})
export class SharedModuleModule { }
