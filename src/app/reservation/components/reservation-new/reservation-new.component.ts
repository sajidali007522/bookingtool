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
  minDateFrom: Date;
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
    this.bsConfig = { containerClass: 'theme-dark-blue', isAnimated: true }
    this.dateFormats = this.DFService.dateFormats;
    this.form.BeginDate = new Date();
    this.form.BeginDate.setDate(this.form.BeginDate.getDate());
    this.form.EndDate = new Date();
    this.form.EndDate.setDate(this.form.EndDate.getDate()+1);
  }
  selectTraveler ($event) {

  }
  searchCleared(type) {
    this.travelerList =[];
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

  setDateTo () {
    this.form.EndDate = this.form.BeginDate;
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

  setSearchParams (tab) {
    this.state.tab = tab;
    //this.setApiEndPoint(tab);
  }
}
