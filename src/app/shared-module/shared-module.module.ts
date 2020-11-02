import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {ModalComponent} from "./components/modal/modal.component";



@NgModule({
  declarations: [LoaderComponent, ModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderComponent,
    ModalComponent
  ]
})
export class SharedModuleModule { }
