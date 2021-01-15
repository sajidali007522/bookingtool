import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderComponent} from "./components/loader/loader.component";
import {AlertModalComponent} from "../shared/alert-modal/alert-modal.component";
import {ConfirmModalComponent} from "../shared/confirm-modal/confirm-modal.component";
import {ModalComponent} from "./components/modal/modal.component";
import {AlertComponent} from "../shared/alert/alert.component";
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import {FormsModule} from "@angular/forms";
import {AutocompleteLibModule} from "angular-ng-autocomplete";


@NgModule({
  declarations: [
    LoaderComponent,
    ModalComponent,
    AlertComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    FormBuilderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AutocompleteLibModule
  ],
  exports:[
    LoaderComponent,
    ModalComponent,
    AlertComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    FormBuilderComponent
  ]
})
export class SharedModuleModule { }
