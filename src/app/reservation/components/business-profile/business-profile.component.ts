import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import{ ChangeDetectorRef } from '@angular/core';
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";


@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit,AfterViewInit, AfterViewChecked {

  @ViewChild(ConfirmModalComponent) childcomp: ConfirmModalComponent;

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
              private cdRef : ChangeDetectorRef,
              public router: Router,
              public resService:ReservationService
  ) {
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
        //this.formFields = data;
        this.loadFields(data);

      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }

  loadFields(fields, eventData={}) {
    ///api2/booking/{bookingID}/AllSearchCriteriaOptions
    let selectedItems = this.resService.renderSelectedItems(fields)
    let searchDefinitions = this.resService.renderSearchCriteriaItems(fields)

    this.state.processing = true;
    this._http._patch('booking/'+this.state.bookingID+'/ReportingOptions',
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      }
    )
      .subscribe(data => {
        this.state.processing=false;
        //console.log(data)
        this.formFields = fields;
        this.definition = data;
        if(eventData['fieldType'] == 'checkbox'){
          this.formFields[eventData['fieldIndex']].model = JSON.parse(JSON.stringify(eventData['field'].model));
          if(this.definition[eventData['fieldIndex']].results && eventData['field'].selectedIndex>=0) {
            this.definition[eventData['fieldIndex']].results[eventData['field'].selectedIndex].isChecked = true
          }
        }
      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }


  renderBookingItems(fields){
    let temp = []
    fields.filter(field=>{
      if(field.isCheckbox){
        if(field.model && typeof field.model.value !== 'undefined') {
          temp.push({
            "relation": (field.fieldRelation|| '00000000-0000-0000-0000-000000000000'),
            "value": field.model.value,
          })
        }
      } else {
        if(field.model) {
          temp.push({
            "relation": (field.fieldRelation|| '00000000-0000-0000-0000-000000000000'),
            "value": (typeof field.model.value !== 'undefined' ? field.model.value : field.model)
          })
        }
      }


    })
    return temp;
  }

  submitForm() {
    if(!this.validateForm()){
      //console.log(this.formFields)
      return;
    }
    let body= this.resService.renderSelectedItems(this.formFields);

    this.resService.saveReservation(this.state.bookingID,body)
      .subscribe(
        res=>{
          this.router.navigate([`/reservation/${this.state.bookingID}/booking`]);
        },
        error => {
          console.log(error)
        }
      )

  }

  validateForm() {
    let validated = true;
    this.formFields.filter(field => {
      field['validationError'] = 'passed'

      if(!field.model && field.isRequired && field.visible && !field.isCheckbox){
        console.log(field)
        field['validationError'] = field.name+ ' is required field';
        validated = false;
      }
    });
    return validated;
  }

  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }

  bindField(event) {
    event = JSON.parse(event);
    console.log(event)
    this.formFields[event.fieldIndex].visible = event.field.visible;
    if(event.fieldType == 'checkbox'){
      this.formFields[event.fieldIndex].model = JSON.parse(JSON.stringify(event.field.model));
      this.formFields[event.fieldIndex].selectedIndex = event.field.selectedIndex;
    }
    this.loadFields(this.formFields, (event.fieldType == 'checkbox' ? event : {}));
  }
  openModal(){
    this.childcomp.openModal();
  }
  restartReservation($event){
    if($event){
      this.router.navigate(['/reservation']);
    }
  }
}
