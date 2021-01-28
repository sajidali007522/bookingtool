import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {DateFormatsService} from "../../../_services/date-formats.service";
import {HttpService} from "../../../http.service";
import {Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";

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
  minDateTo: Date;
  dateFormats;
  profileTypeSelected;
  keyword="text";
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
    errorMsg: '',
    isLoadingTraveler:false,
    loadingTemplate: false,
    loadingGroups: false,
    selectedGroup: {},
    initiateBooking: false,
    processing:false,
    errors: '',
    templateGroups: [],
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
              public resService: ReservationService
  ) {
    this.bsConfig = { containerClass: 'theme-dark-blue', isAnimated: true, showPreviousMonth: false }
    this.dateFormats = this.DFService.dateFormats;

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
    this._http._get("booking/"+this.form.bookingID+"/RuleBag", {'ruleBagID': this.form.ResourceTypeID})
      .subscribe(data => {
        console.log(data)
      },error => {
        console.log(error)
        this.state.error = error;
        this.state.isLoadingTraveler = false;
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
    this.state.selectedTemplate['resources'][resourceIndex].EndDate = this.state.selectedTemplate['resources'][resourceIndex].BeginDate;
  }

  setDateFrom(resourceIndex) {
    // console.log(new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate) > new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate))
    // console.log(new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate))
    // console.log(new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate))
    if(new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate) > new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate)) {
      this.state.selectedTemplate['resources'][resourceIndex].BeginDate = this.state.selectedTemplate['resources'][resourceIndex].EndDate;
    }
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
    this.form.template= '000000000-0000-0000-0000-000000000000';

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
        this.state.loadingTemplate = false;
      },
        error => {this.state.loadingTemplate = false;});
  }

  startBookingSearch () {
    if(!this.form.ResourceTypeID) {
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
    this._http._post("Booking/"+this.form.bookingID+"/Book", postBody['resultsToBook'], {'bookingID': this.form.bookingID})
      .subscribe(data => {
          this.state.processing=false;
          console.log(data)
          if(data.toString().indexOf('BusinessProfile') == -1) {
            this.router.navigate(['/reservation/' + this.form.bookingID + '/search/' + data['resourceTypeID']]);
          } else {
            this.router.navigate(['/reservation/' + this.form.bookingID + '/business-profile/']);
          }
        },
        error => {
          console.log(error);
          this.state.processing=false;
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

  setSearchParams (tab) {
    this.state.tab = tab;
    //this.setApiEndPoint(tab);
  }
}
