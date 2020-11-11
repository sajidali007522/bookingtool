import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {AlertModalComponent} from "../shared/alert-modal/alert-modal.component";
import {ConfirmModalComponent} from "../shared/confirm-modal/confirm-modal.component";
import {ModalComponent} from "./components/modal/modal.component";
import {AlertComponent} from "../shared/alert/alert.component";
import {ConfirmModalComponent} from "../shared/confirm-modal/confirm-modal.component";



@NgModule({
  declarations: [
    LoaderComponent,
    ModalComponent,
    AlertComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    LoaderComponent,
    ModalComponent,
    AlertComponent,
    ConfirmModalComponent
  ]
})
export class SharedModuleModule { }
