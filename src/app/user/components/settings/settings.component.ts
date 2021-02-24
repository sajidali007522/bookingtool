import { Component, OnInit } from '@angular/core';
import {DateFormatsService} from "../../../_services/date-formats.service";
import {UserService} from "../../../_services/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  state ={
    processing: false
  }
  form={
    dateFormat: '',
    timeFormat: ''
  }
  constructor( public dfService: DateFormatsService,
               public userService: UserService) { }

  ngOnInit(): void {
    this.form = this.userService.getCulturalSettings();
  }

  submitForm(){
    this.userService.setCulturalSettings(this.form)
  }

}
