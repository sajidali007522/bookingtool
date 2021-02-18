import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {DateFormatsService} from "../../../_services/date-formats.service";
import {HttpService} from "../../../http.service";
import {Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";
import {ToastrService} from "ngx-toastr";
import {TimepickerService} from "../../../_services/timepicker.service";

@Component({
  selector: 'app-reservation-new',
  templateUrl: './reservation-new.component.html',
  styleUrls: ['./reservation-new.component.css']
})
export class ReservationNewComponent implements OnInit,AfterViewInit {
  ruleBags = []
  travelerList = []
  defaultSelection;
  bsConfig: Partial<BsDatepickerConfig>;
  minDateFrom= new Date();
  maxDateFrom= new Date();
  minDateTo: Date;
  dateFormats;
  profileTypeSelected;
  keyword= "text";
  timePickerkeyword="searchText";
  form = {
    BeginDate: new Date(),
    EndDate: new Date(),
    BeginTime: '',
    EndTime: '',
    bookingID: '',
    ResourceTypeID:'',
    template: ''
  }
  state={
    error: {message: ''},
    formErrors: [],
    errorMsg: '',
    isLoadingTraveler:false,
    beginTimeProcessing:false,
    loadingTemplate: false,
    loadingGroups: false,
    isSearching: false,
    assigningBusinessProfile: false,
    selectedGroup: {},
    initiateBooking: false,
    processing:false,
    errors: '',
    templateGroups: [],
    selectedResource: '',
    templateList: [],
    selectedTemplate: {},
    tab: '',
    bundle:{
      templateId:'00000000-0000-0000-0000-000000000000',
      resourceType: 0,
      template: []
    }
  };

  constructor(private DFService: DateFormatsService,
              private _http: HttpService,
              private router: Router,
              public template: TemplateService,
              public resService: ReservationService,
              private toastr: ToastrService,
              public TPService: TimepickerService
  ) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      isAnimated: true,
      showPreviousMonth: false,
      showWeekNumbers:false
    }

    this.dateFormats = this.DFService.dateFormats;
    this.maxDateFrom.setDate(5*365)
    // this.form.BeginDate = new Date();
    // this.form.BeginDate.setDate(this.form.BeginDate.getDate());
    // this.form.EndDate = new Date();
    // this.form.EndDate.setDate(this.form.EndDate.getDate()+1);
  }
  selectTraveler ($event) {

  }
  searchCleared(type) {
    this.travelerList =[];
  }


  assignRuleBag () {
    ///api2/booking/{bookingID}/RuleBag
    if(this.state.assigningBusinessProfile) return;
    this.state.formErrors['ResourceTypeID'] = ''
    this.state.assigningBusinessProfile = true
    this._http._get("booking/"+this.form.bookingID+"/RuleBag", {'ruleBagID': this.form.ResourceTypeID})
      .subscribe(data => {
        console.log(data)
        this.state.assigningBusinessProfile = false
      },error => {
        console.log(error)
        this.state.error = error;
        this.state.assigningBusinessProfile = false
      });
  }
  getloadProfiles (event) {
    let params = {searchTerm: event};
    params['criteria'] = this.profileTypeSelected;
    this.travelerList =[];
    this.state.isLoadingTraveler =true;
    this._http._get("lookup/ProfileLookupSearch", params)
      .subscribe(data => {
        this.defaultSelection = data['data']['defaultValue'];
        this.travelerList = data['data']['results'];
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }

  setDateTo (resourceIndex) {
    let beginDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate);
    let endDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate);

    if(beginDate > endDate) {
      this.state.selectedTemplate['resources'][resourceIndex].EndDate = this.state.selectedTemplate['resources'][resourceIndex].BeginDate;
    }
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
  }
  resetErrorState(resourceIndex, property){
    this.state.selectedTemplate['resources'][resourceIndex]['errors'][property] = '';
  }

  ngOnInit(): void {
    this.StartBooking();
  }

  ngAfterViewInit() {

    $("ng-autocomplete input[type='text']").on('blur', (event) => {
      //console.log($(event.target).parents('ng-autocomplete')) //.attr('name'));
      //this.selectDefaultValue($(event.target).parents('ng-autocomplete').attr('name'));
    });

  }

  onFocused(e){
    // do something when input is focused
  }

  setTemplateGroup (group) {
    this.state.selectedGroup = group
    this.state.selectedTemplate= {};
    this.form.template= '00000000-0000-0000-0000-000000000000';

    if(typeof this.state.selectedGroup['templates'][0]['templateID'] !== 'undefined') {
      this.loadTemplate(this.state.selectedGroup['templates'][0]['templateID']);
    }
  }

  StartBooking () {
    this.state.initiateBooking=true;
    this._http._get("Booking/Start")
      .subscribe(data => {
        if(data['ruleBags']) {
          this.ruleBags = data['ruleBags'];
        }
        if(data['bookingID']) {
          this.form.bookingID = data['bookingID'];
          this.loadTemplateGroups()
        }
        this.state.initiateBooking = false;
      });
  }

  loadTemplateGroups() {
    if(this.state.loadingGroups) return
    this.state.loadingGroups = true;
    this.resService.loadSingleResource(this.form.bookingID)
      .subscribe(data => {
        //console.log(data['data']);
        this.state.templateGroups = data['data']['templateGroups'];
        this.state.selectedGroup = data['data']['templateGroups'][0]
        if(typeof this.state.selectedGroup['templates'][0]['templateID'] !== 'undefined') {
          this.loadTemplate(this.state.selectedGroup['templates'][0]['templateID']);
        }
        this.state.loadingGroups = false;
      },
        err => {this.state.loadingGroups=false});
  }

  loadTemplate (templateId){
    if(typeof templateId == 'undefined' || templateId == '00000000-0000-0000-0000-000000000000') return;
    if(this.state.loadingTemplate) return
    this.state.loadingTemplate = true;
    this.form.template = templateId;
    this._http._get("booking/"+this.form.bookingID+"/SearchCriteriaDefinition", {templateID: templateId})
      .subscribe(data => {
        this.state.selectedTemplate= data;
        if(this.state.selectedTemplate['resources'].length>0) {
          this.state.selectedTemplate['resources'][this.state.selectedTemplate['resources'].length-1].isOpen = true;
        }
        if(this.state.selectedTemplate['isDynamic']) {
          this.state.selectedTemplate['$resources'] =this.state.selectedTemplate['resources'];
          if(this.state.selectedTemplate['$resources'].length == 1) {
            this.state.selectedResource = this.state.selectedTemplate['$resources'][0]
          }
          this.state.selectedTemplate['resources'] = [];
        }
        this.state.loadingTemplate = false;
        this.setResourcesDate();
      },
        error => {this.state.loadingTemplate = false;});
  }
  setResourcesDate () {
    for (let index =0; index<this.state.selectedTemplate['resources'].length; index++) {
      this.state.selectedTemplate['resources'][index]['BeginDate'] = new Date();
      //this.state.selectedTemplate['resources'][index]['BeginDate'].setDate(this.state.selectedTemplate['resources'][index]['BeginDate']);
      this.state.selectedTemplate['resources'][index]['EndDate'] = new Date();
      this.state.selectedTemplate['resources'][index]['errors'] = {'BeginDate': '', 'EndDate': ''}
      //this.state.selectedTemplate['resources'][index]['EndDate'].setDate(this.state.selectedTemplate['resources'][index]['EndDate']);
    }
  }

  startBookingSearch () {
    if(this.state.isSearching) return;
    this.state.formErrors['ResourceTypeID'] = '';
    if(!this.form.ResourceTypeID) {
      this.state.formErrors['ResourceTypeID'] = 'Please set Business Profile to continue.';
      //this.toastr.error('Please set Business Profile to continue.', 'Error!')
      return;
    }
    if(!this.validateForm()){
      return;
    }
    let postBody = {
      "sessionID": "undefined",
      'bookingID': this.form.bookingID,
      'resultsToBook': this.renderResources(),
      'resourceIndex': null,
      'resourceTypeID': null,
      'requireInOrder': false,
      'addItems': false
    }
    this.state.isSearching = true;
    this._http._post("Booking/"+this.form.bookingID+"/Book", postBody['resultsToBook'], {'bookingID': this.form.bookingID})
      .subscribe(data => {
          this.state.isSearching =false;
          console.log(data)
          if(data.toString().indexOf('BusinessProfile') == -1) {
            this.router.navigate(['/reservation/' + this.form.bookingID + '/search/' + data['resourceTypeID']]);
          } else {
            this.router.navigate(['/reservation/' + this.form.bookingID + '/business-profile/']);
          }
        },
        error => {
          console.log(error);
          this.state.isSearching =false;
          this.state.errors = error;
        });
  }

  renderResources () {
    let resources=[];
    if(this.state.selectedTemplate['resources'].length > 0) {
      for (let index = 0; index < this.state.selectedTemplate['resources'].length; index++) {
        let resource = this.state.selectedTemplate['resources'][index]
        let resourceBody = {}
        let departure;
        let arrival;
        if (this.state.selectedTemplate['isDynamic']) {
          departure = new Date(resource['BeginDate']);
          arrival = new Date(resource['EndDate']);
        } else {
          departure = new Date(this.state.selectedTemplate['resources'][0]['BeginDate']);
          arrival = new Date(this.state.selectedTemplate['resources'][0]['EndDate']);
        }

        resources.push({
          "resultID": "",
          "searchID": "00000000-0000-0000-0000-000000000000",
          "searchIndex": 0,
          "priceID": "",
          "BeginDate": departure.getFullYear() + '-' + (departure.getMonth() + 1) + "-" + departure.getDate(),
          "EndDate": arrival.getFullYear() + '-' + (arrival.getMonth() + 1) + "-" + arrival.getDate(),
          "ResourceTypeID": resource['resourceTypeID'],
          "TimePropertyID": resource['timePropertyID'],
          "IsReturn": resource['IsReturn'],
          "SearchIndex": 0,
          "SelectedItems": this.renderResouceFields(resource),
          "IsDynamic": this.state.selectedTemplate['isDynamic']
        });
      }
    }
    return resources;
  }

  renderResouceFields (resource) {
    let fields = [];
    if(resource.searchFields.length > 0 ){
      for(let index=0; index<resource.searchFields.length; index++){
        let field = resource.searchFields[index];
        fields.push({
          "Relation": field['fieldRelation'],
          "Selection": field['model']['value'],
          "SelectionText": field['model']['text'],
          "Type": field['type']
        })
      }
    }
    return fields;
  }

  addResourceToTemplate () {
    if(this.state.selectedResource == '') return
    let temp = JSON.parse(JSON.stringify(this.state.selectedResource));
    /*if(this.state.selectedTemplate['resources'].length > 0 ) {
      this.state.selectedTemplate['resources'].filter(res => {
        res['isOpen'] = false;
      })
    }*/
    temp['BeginDate'] = new Date();
    temp['EndDate'] = new Date();
    temp['isOpen'] = true;
    temp['errors'] = {'BeginDate': '', 'EndDate': ''}
    this.state.selectedTemplate['resources'].push(temp)
    // if(this.state.selectedTemplate['$resources'].length > 1) {
    //   this.state.selectedResource = ''
    // }
    temp = {};
    setTimeout(()=>{
      let element = document.getElementById("accordion_"+(this.state.selectedTemplate['resources'].length-1));
      console.log("accordion_"+(this.state.selectedTemplate['resources'].length-1), element)
      element.scrollIntoView();
      element.classList.add('shake')
    }, 100)

    //accordion_3
  }
  removeResource(index){
    if(!this.state.selectedTemplate['isDynamic']) return;
    this.state.selectedTemplate['resources'].splice(index,1)
  }

  validateForm() {
    let validated = true;
    this.state.selectedTemplate['resources'].filter(resource => {
      resource['errors'] = {};
      console.log(resource['BeginDate'])
      if(!resource['BeginDate']) {
        resource['errors']['BeginDate'] =  'Begin Date is required field.'
        validated = false;
      }
      console.log(resource['EndDate'])
      if(!resource['EndDate'] && resource.requiresEndDate) {
        resource['errors']['EndDate'] = 'End Date is required field.';
        validated = false;
      }
      resource.searchFields.filter(field=>{
        field['validationError'] = 'passed'
        if(!field.model && field.isRequired){
          field['validationError'] = field.name+ ' is required field';
          validated = false;
        }
      })
    });
    return validated;
  }
  setSearchParams (tab) {
    this.state.tab = tab;
    //this.setApiEndPoint(tab);
  }

  selectTime (item, resourceIndex, model) {
    this.state.selectedTemplate['resources'][resourceIndex][model] = item.text;
  }
}
