import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import{ ChangeDetectorRef } from '@angular/core';
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit,AfterViewInit, AfterViewChecked {

  formFields = <any>[];
  definition = <any>[]
  form = {}
  state={
    processing: false,
    error: {message: ''},
    errorMsg: '',
    bookingID: '',
    searchId: ''
  };

  constructor(
              private _http: HttpService,
              private activatedRoute: ActivatedRoute,
              public template: TemplateService,
              private cdRef : ChangeDetectorRef
  ) {
    // this.form.BeginDate = new Date();
    // this.form.BeginDate.setDate(this.form.BeginDate.getDate());
    // this.form.EndDate = new Date();
    // this.form.EndDate.setDate(this.form.EndDate.getDate()+1);
  }
  selectTraveler ($event) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.state.bookingID = params["booking_id"];
      this.state.searchId = params['search_id'];
    });
    this.setProfile();
  }

  ngAfterViewInit() {

    $("ng-autocomplete input[type='text']").on('blur', (event) => {
      //console.log($(event.target).parents('ng-autocomplete')) //.attr('name'));
      //this.selectDefaultValue($(event.target).parents('ng-autocomplete').attr('name'));
    });

  }
  setProfile(){
    //​/api2​/booking​/{bookingID}​/Reporting
    this.state.processing = true;
    this._http._get('booking/'+this.state.bookingID+'/Reporting', {})
      .subscribe(data => {
        this.state.processing=false;
        console.log(data)
        this.formFields = data;
        //this.loadFields();
      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }
  loadFields() {
    ///api2/booking/{bookingID}/AllSearchCriteriaOptions
    this.state.processing = true;
    this._http._post('booking/'+this.state.bookingID+'/SearchCriteriaOptions', {'selectedItems': [], 'lookupSearchCriterias': this.definition })
      .subscribe(data => {
        this.state.processing=false;
        console.log(data)
        this.formFields = data;
      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }
  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }

  bindField(event) {

    event = JSON.parse(event);
    this.formFields[event.fieldIndex].visible = event.field.visible;
  }
}
