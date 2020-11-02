import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {ModalComponent} from "./components/modal/modal.component";
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';



@NgModule({
  declarations: [LoaderComponent, ModalComponent, ConfirmModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderComponent,
    ModalComponent,
    ConfirmModalComponent
  ]
})
export class SharedModuleModule { }
