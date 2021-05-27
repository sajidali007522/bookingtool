import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import{ ChangeDetectorRef } from '@angular/core';
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";
import {ReservationServiceV4} from "../../../_services/reservation_v4.service";
import {DateParser} from "../../../_helpers/dateParser";
import {UserService} from "../../../_services/user.service";
import {TimepickerService} from "../../../_services/timepicker.service";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit,AfterViewInit, AfterViewChecked {

  @ViewChild(ConfirmModalComponent) childcomp: ConfirmModalComponent;

  formFields = <any>[];
  definition = <any>[]
  form = {resourceTypeID:'', definition: []}
  travelerList = []
  keyword= "lastDashFirst";
  timePickerkeyword="text";
  myForm= {}
  canceler;

  minDateFrom= new Date();
  maxDateFrom= new Date();

  bsConfig: Partial<BsDatepickerConfig>;
  state={
    selectedResource: '',
    loadingGroups : false,
    isLoadingTraveler:false,
    beginTimeProcessing:false,
    loadingTemplate: false,
    bookingContentArea: true,
    sessionID: '',
    processing: false,
    error: {message: ''},
    errorMsg: '',
    bookingID: '',
    searchId: '',
    bookedSegments: [],
    addableResourceTypes: [],
    selectedTemplate: {},
  };

  constructor(
              private _http: HttpService,
              private activatedRoute: ActivatedRoute,
              public template: TemplateService,
              private cdRef : ChangeDetectorRef,
              public router: Router,
              public resService:ReservationServiceV4,
              private ref: ChangeDetectorRef,
              public dateParse: DateParser,
              public userService:UserService,
              public TPService: TimepickerService,
              private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.state.bookingID = params["booking_id"];
      this.state.searchId = params['search_id'];
      this.state.sessionID = params['session_id'];
    });
    this.setProfile();
    this.loadAddableResourceTypes();
    this.getBookedSegment();
  }

  ngAfterViewInit() {

    $("ng-autocomplete input[type='text']").on('blur', (event) => {
      //console.log($(event.target).parents('ng-autocomplete')) //.attr('name'));
      //this.selectDefaultValue($(event.target).parents('ng-autocomplete').attr('name'));
    });

  }

  loadAddableResourceTypes() {
    this.resService.loadAddableResourceTypes(this.state.bookingID, {
      'sessionID': this.state.sessionID
    })
      .subscribe(res=>{
        if(res['status'] == 200) {
          this.state.addableResourceTypes = res['data'];
        } else {

        }
      })
  }
  getBookedSegment(){
    ///api4/booking/{bookingID}/BookedSegments
    this.resService.getBookedSegments(this.state.bookingID, {
      'sessionID': this.state.sessionID
    })
      .subscribe(res=>{
        if(res['status'] == 200) {
          this.state.bookedSegments = res['data'];
        } else {

        }
      })
  }

  loadCriteriaDefinitions(){
    if(this.state.loadingTemplate) return
    this.state.loadingTemplate = true
    this.resService.loadCriteriaDefinitions(this.state.bookingID, this.form.resourceTypeID, {
      'sessionID': this.state.sessionID
    })
      .subscribe(res=>{
        if(res['status'] == 200) {
          this.state.selectedTemplate = res['data'];
          if (this.state.selectedTemplate['resources'].length > 0) {
            this.state.selectedTemplate['resources'][this.state.selectedTemplate['resources'].length - 1].isOpen = true;
          }
          /*if (this.state.selectedTemplate['isDynamic']) {
            this.state.selectedTemplate['$resources'] = this.state.selectedTemplate['resources'];
            if (this.state.selectedTemplate['$resources'].length == 1) {
              this.state.selectedResource = this.state.selectedTemplate['$resources'][0]
            }
            this.state.selectedTemplate['resources'] = [];
          }*/
          this.setResourcesDate();
        }
        this.state.loadingTemplate = false;
      },
        err=>{
          this.state.loadingTemplate = false;
        })
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


  toggleBookingContentArea (state) {
    this.state.bookingContentArea = state;
  }

  getloadProfiles (event) {
    let params = {searchTerm: event};
    params['criteria'] = this.form.resourceTypeID || '00000000-0000-0000-0000-000000000000';
    params['sessionID'] = this.state.sessionID;

    this.travelerList =[];
    this.state.isLoadingTraveler =true;
    if(this.canceler) { this.canceler.unsubscribe()}
    this.canceler = this.resService.getProfiles(this.state.bookingID, params)
      .subscribe(data => {
        if(data['success']) {
          // this.defaultSelection = data['data']['defaultValue'];
          this.travelerList = data['data'];
        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }

  selectTraveler ($event) {
    console.log($event)
    this.resService.setProfile(this.state.bookingID, {guestProfileID: $event.id, sessionID: this.state.sessionID})
      .subscribe(data => {
        if(data['success']) {
          // this.defaultSelection = data['data']['defaultValue'];
          console.log(data);
        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }
  searchCleared(type) {
    this.travelerList =[];
  }

  onFocused(e){
    // do something when input is focused
  }

  removeResource(index){
    if(!this.state.selectedTemplate['isDynamic']) return;
    this.state.selectedTemplate['resources'].splice(index,1)
  }

  selectTime (item, resourceIndex, model) {
    this.state.selectedTemplate['resources'][resourceIndex][model] = item.text;
  }

  setDateTo (resourceIndex) {
    let beginDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate);
    let endDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate);

    if(beginDate > endDate) {
      this.state.selectedTemplate['resources'][resourceIndex].EndDate = this.state.selectedTemplate['resources'][resourceIndex].BeginDate;
    }
    //if(this.state.selectedGroup['name'] == 'Templates'){
      this.loadBookingFields(this.state.selectedTemplate['resources'][resourceIndex].searchFields, resourceIndex, -1)
    //}
  }


  loadBookingFields(fields, resourceIndex, fieldIndex, eventData={}) {
    ///api2/booking/{bookingID}/AllSearchCriteriaOptions
    //console.log(JSON.parse(JSON.stringify(fields)))
    console.log(resourceIndex)
    let selectedItems = this.resService.renderSelectedItems(fields)
    //alert(this.state.selectedTemplate['resources'][resourceIndex]['resourceTypeID'])
    let searchDefinitions = this.resService.renderSearchCriteriaItems(fields, this.state.selectedTemplate['resources'][resourceIndex]['resourceTypeID'])
    if(this.state.selectedTemplate['resources'][resourceIndex]['processing']) return;
    this.state.selectedTemplate['resources'][resourceIndex]['processing'] = true;
    //this._http._post('booking/'+this.form.bookingID+'/AllSearchCriteriaOptions',
    this.resService.setCriteriaDefinition(this.state.bookingID,
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      },
      {
        'sessionID': this.state.sessionID
      }
    )
      .subscribe(data => {
          //console.log(resourceIndex, fields, data)
          this.state.selectedTemplate['resources'][resourceIndex]['processing']=false;
          //console.log(data)
          //this.definition = data;
          this.state.selectedTemplate['resources'][resourceIndex]['searchFields'] = fields
          this.state.selectedTemplate['resources'][resourceIndex]['definitions'] = data['data'];
          //console.log(this.state.selectedTemplate['resources'][resourceIndex].searchFields);

        }, error => {
          console.log(error)
          let message = error.split('.')
          this.toastr.error(message[0], 'Error!')
          this.state.selectedTemplate['resources'][resourceIndex]['processing'] = false;
        },
        ()=>{

          for(let index=0; index<this.state.selectedTemplate['resources'][resourceIndex].searchFields.length; index++){
            this.state.selectedTemplate['resources'][resourceIndex].searchFields[index]['fieldDefinition'] = this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index];
            this.state.selectedTemplate['resources'][resourceIndex].searchFields[index]['visible'] = this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index]['isValidForSelection'] == true
            if(this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].validationError &&
              this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].validationError != 'passed' &&
              this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].selectedValue != ''
            ) {
              this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].validationError = 'passed'
            }
            if(this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].results){
              let selectedValue = this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].results.filter(item =>{
                console.log(index, item.value == this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].selectedValue)
                if(item.value == this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].selectedValue){
                  console.log(item);
                  return item;
                }
              });
              if(selectedValue.length) {
                this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].model = selectedValue[0];
              }
            }
          }
          //this.setResourcesDate()
        }
      )
  }

  getSearchId (fields, resource, resourceIndex, resourceItemIndex, resourceTypeID='00000000-0000-0000-0000-000000000000') {
    //validateForSearch
    if(!this.validateBookForm(false)) return;
    if(this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['processing']) return;
    let selectedItems = this.resService.renderSelectedItems(resource.searchFields, 1)
    //console.log(JSON.parse(JSON.stringify(fields)))

    let body = this.resService.prepareBody(resource, resourceTypeID, selectedItems)
    this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['processing'] = true;
    //this._http._post(`booking/${this.form.bookingID}/Search`, body)
    this.resService.makeSearch(this.state.bookingID, body, {sessionID: this.state.sessionID})
      .subscribe(data => {
          console.log(data);
          //     this.state.selectedTemplate['resources'][resourceIndex]['searching'] = false;
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['searchID'] = data['data']['searchID'];
          this.getSearchResults(fields, resource, resourceIndex, resourceItemIndex, data['data']['searchIndeces'][0], resourceTypeID);

        },
        err => {
          this.state.loadingGroups=false;
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['processing']=false
        });
  }

  getSearchResults (bodyfields, resource, resourceIndex, resourceItemIndex, searchIndeces, resourceTypeID='00000000-0000-0000-0000-000000000000') {
    this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['processing'] = true;
    //this._http._get(`booking/${this.form.bookingID}/SearchResults/${this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['searchID']}`,
    this.resService.getSearchResults(this.state.bookingID, this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['searchID'], searchIndeces,
      {
        searchIndex:0,
        flattenValues:true,
        bookingItemProperties: 'Text|UniqueID',
        sortProperties: 'BookingItem.BeginDate',
        isAscending:true,
        sessionID: this.state.sessionID
      }
    )
      .subscribe(data => {
          console.log(data);
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['processing'] = false
          //this.form['searchID'] = data['searchID'];
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['model'] = '';
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['results'] =  data['data']['results'];
        },
        err => {
          this.state.loadingGroups=false;
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'][resourceItemIndex]['processing'] = false
        }
      );
  }


  validateBookForm(setError=true) {
    let validated = true;
    this.state.selectedTemplate['resources'].filter(resource => {
      resource['errors'] = {};
      //console.log(resource['BeginDate'])
      if(!resource['BeginDate']) {
        if(setError) {
          resource['errors']['BeginDate'] = 'Begin Date is required field.'
        }
        validated = false;
      }
      //console.log(resource['EndDate'])
      if(!resource['EndDate'] && resource.requiresEndDate) {
        if(setError) {
          resource['errors']['EndDate'] = 'End Date is required field.';
        }
        validated = false;
      }
      /*if(!resource['BeginTime'] && resource.canSearchByTime) {
        resource['errors']['BeginTime'] = 'Begin time is required field.';
        validated = false;
      }

      if(!resource['EndTime'] && resource.canSearchByTime && resource.requiresEndDate) {
        resource['errors']['EndTime'] = 'End time is required field.';
        validated = false;
      }*/

      resource.searchFields.filter(field=>{
        field['validationError'] = 'passed'
        if(field.isRequired && (!field.model || field.model == '00000000-0000-0000-0000-000000000000')){
          if(setError) {
            field['validationError'] = field.name+ ' is required field';
          }
          validated = false;
        }
      })
    });
    return validated;
  }


  setDateFrom(resourceIndex) {
    // console.log(new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate) > new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate))
    // console.log(new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate), typeof new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate))
    // console.log(new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate))
    // console.log(this.state.selectedTemplate['resources'][resourceIndex].BeginDate == '')
    let beginDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate);
    let endDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate);

    if(this.state.selectedTemplate['resources'][resourceIndex].BeginDate == '' || beginDate > endDate) {
      this.state.selectedTemplate['resources'][resourceIndex].BeginDate = this.state.selectedTemplate['resources'][resourceIndex].EndDate;
    }

      this.loadBookingFields(this.state.selectedTemplate['resources'][resourceIndex].searchFields, resourceIndex, -1)
    //}
  }
  resetErrorState(resourceIndex, property){
    this.state.selectedTemplate['resources'][resourceIndex]['errors'][property] = '';
  }

  setResourcesDate (name='') {
    for (let index =0; index<this.state.selectedTemplate['resources'].length; index++) {
      this.state.selectedTemplate['resources'][index]['BeginDate'] = new Date();
      //this.state.selectedTemplate['resources'][index]['BeginDate'].setDate(this.state.selectedTemplate['resources'][index]['BeginDate']);
      this.state.selectedTemplate['resources'][index]['EndDate'] = new Date();
      this.state.selectedTemplate['resources'][index]['errors'] = {'BeginDate': '', 'EndDate': ''}
      this.state.selectedTemplate['resources'][index]['ReturnTimeFormat'] = ''
      this.state.selectedTemplate['resources'][index]['BeginTimeFormat'] = ''
      //this.state.selectedTemplate['resources'][index]['EndDate'].setDate(this.state.selectedTemplate['resources'][index]['EndDate']);
      //alert(name)
      if(name == 'Round Trip'){
        this.state.selectedTemplate['resources'][index]['EndDate'].setDate(this.state.selectedTemplate['resources'][index]['EndDate'].getDate()+1)
        //alert(this.state.selectedTemplate['resources'][index]['EndDate'])
      }
      //if(this.state.selectedGroup['name'] == 'Templates') {
        this.state.selectedTemplate['resources'][index]['definitions'] = this.state.selectedTemplate['resources'][index].searchFields
        this.loadBookingFields(this.state.selectedTemplate['resources'][index].searchFields, index, -1)
      //}
    }
  }



}
