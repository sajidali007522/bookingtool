import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import{ ChangeDetectorRef } from '@angular/core';
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";
import {ReservationServiceV4} from "../../../_services/reservation_v4.service";


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
    sessionID: '',
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
              public resService:ReservationServiceV4,
              private ref: ChangeDetectorRef,
  ) {
  }

  selectTraveler ($event) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.state.bookingID = params["booking_id"];
      this.state.searchId = params['search_id'];
      this.state.sessionID = params['session_id'];
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
    this.resService.getBusinessProfileReporting(this.state.bookingID, {sessionID: this.state.sessionID})
    //this._http._get('booking/'+this.state.bookingID+'/Reporting', {})
      .subscribe(data => {
        this.state.processing=false;
        console.log(data['data'])
        //this.formFields = data;
        this.loadFields(data['data']['searchFields']);

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
    /*this._http._patch('booking/'+this.state.bookingID+'/ReportingOptions',
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      }
    )*/
    this.resService.reportingOptions(this.state.bookingID,
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      },
      {
        'sessionID': this.state.sessionID
      }
    )
      .subscribe(data => {
        this.state.processing=false;
        //console.log(data)
        this.formFields = fields;
        this.definition = data['data'];
        if(eventData['fieldType'] == 'checkbox'){
          this.formFields[eventData['fieldIndex']].model = JSON.parse(JSON.stringify(eventData['field'].model));
          if(this.definition[eventData['fieldIndex']].results && eventData['field'].selectedIndex>=0) {
            this.definition[eventData['fieldIndex']].results[eventData['field'].selectedIndex].isChecked = true
          }
        }
      }, error => {
        console.log(error)
        this.state.processing=false;
      },
        ()=>{

        for(let index=0; index<this.formFields.length; index++){
          this.formFields[index]['fieldDefinition'] = this.definition[index];
          this.formFields[index]['visible'] = this.definition[index]['isValidForSelection'] == true;
          if(!this.formFields[index].isRequired && this.formFields[index]['fieldDefinition']['results'].length<=0 && (this.formFields[index] != 'autocomplete' && this.formFields[index] != 'text')){
            this.formFields[index]['visible'] = false
          }
          if(this.definition[index].results){
            let selectedValue = this.definition[index].results.filter(item =>{
              //console.log(index, item.value == this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].selectedValue)
              if(item.value == this.definition[index].selectedValue){
                //console.log(item);
                return item;
              }
            });
            if(selectedValue.length) {
              this.formFields[index].model = selectedValue[0];
            }
          }
        }
        this.ref.detectChanges();
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
    this.state.processing = true;
    this.resService.saveReservation(this.state.bookingID,body, {sessionID: this.state.sessionID})
      .subscribe(
        res=>{
          this.state.processing = false;
          if(res['data']) {
            this.router.navigate([`/reservation/${this.state.bookingID}/booking/${this.state.sessionID}`]);
          }
          else{
            console.log(res)
          }

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
      //console.log(field)
      if(field.isRequired && field.visible && !field.isCheckbox) {
        if (field.allowFreeText && !field.model.split(" ").join("")) {
          //console.log(field)
          field['validationError'] = field.name + ' is required field';
          validated = false;
        } else if (!field.allowFreeText && !field.model.value) {
          field['validationError'] = field.name + ' is required field';
          validated = false;
        }
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
