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
import {UserService} from "../../../_services/user.service";

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
  keyword= "lastDashFirst";
  timePickerkeyword="text";
  canceler;

  form = {
    BeginDate: new Date(),
    EndDate: new Date(),
    BeginTime: '',
    EndTime: '',
    bookingID: '',
    ResourceTypeID:'',
    template: ''
  }
  myForm={};
  state={
    bannerText: '', //'<strong>ようこそ</strong> Welcome Bienvenue Marhaba',
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
  definition;

  constructor(private DFService: DateFormatsService,
              private _http: HttpService,
              private router: Router,
              public template: TemplateService,
              public resService: ReservationService,
              private toastr: ToastrService,
              public TPService: TimepickerService,
              public userService:UserService
  ) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      isAnimated: true,
      showPreviousMonth: false,
      showWeekNumbers:false,
    }
    let dateFormat = this.userService.getSettingByProp('dateFormat')
    if(dateFormat){
      this.bsConfig['dateInputFormat'] = dateFormat;
    }

    this.dateFormats = this.DFService.dateFormats;
    this.maxDateFrom.setDate(5*365)

  }

  selectTraveler ($event) {
    console.log($event)
    this.resService.setProfile(this.form.bookingID, {guestProfileID: $event.id})
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
    if(this.canceler) { this.canceler.unsubscribe()}
    this.canceler = this.resService.getProfiles(this.form.bookingID, params)
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

  setDateTo (resourceIndex) {
    let beginDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].BeginDate);
    let endDate = new Date(this.state.selectedTemplate['resources'][resourceIndex].EndDate);

    if(beginDate > endDate) {
      this.state.selectedTemplate['resources'][resourceIndex].EndDate = this.state.selectedTemplate['resources'][resourceIndex].BeginDate;
    }
    if(this.state.selectedGroup['name'] == 'Templates'){
      this.loadFields(this.state.selectedTemplate['resources'][resourceIndex].searchFields, resourceIndex, -1)
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
    if(this.state.selectedGroup['name'] == 'Templates'){
      this.loadFields(this.state.selectedTemplate['resources'][resourceIndex].searchFields, resourceIndex, -1)
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
          //this.getSearchId();
        }
        if(data['bannerMessage']) {
          this.state.bannerText =data['bannerMessage'].replace(/(<([^>]+)>)/gi, "")
        }

        this.state.initiateBooking = false;
      });
  }

  getSearchId (fields, resource, resourceIndex, resourceTypeID='00000000-0000-0000-0000-000000000000') {
    let selectedItems = this.resService.renderSelectedItems(resource.searchFields, 1)
    console.log(JSON.parse(JSON.stringify(fields)))

    let body = this.resService.prepareBody(resource, resourceTypeID, selectedItems)
    this._http._post(`booking/${this.form.bookingID}/Search`, body)
      .subscribe(data => {
          console.log(data);
          this.form['searchID'] = data['searchID'];
          this.getSearchResults(fields, resource, resourceIndex, resourceTypeID);

        },
        err => {this.state.loadingGroups=false});
  }

  getSearchResults (bodyfields, resource, resourceIndex, resourceTypeID='00000000-0000-0000-0000-000000000000') {
    this._http._get(`booking/${this.form.bookingID}/SearchResults/${this.form['searchID']}`,

      {
        searchIndex:0,
        flattenValues:true,
        bookingItemProperties: 'Text|UniqueID',
        sortProperties: 'BookingItem.BeginDate',
        isAscending:true
       }
      )
      .subscribe(data => {
          console.log(data);
          //this.form['searchID'] = data['searchID'];
          this.state.selectedTemplate['resources'][resourceIndex]['resourceItems'].filter(item => {
            if(item.isBlockable){
              item['results'] = data['results']
            }
          });


        },
        err => {this.state.loadingGroups=false});
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

        //this.setResourceItems();
      },
        error => {this.state.loadingTemplate = false;});
  }

  setResourceItems () {
    let fields = this.state.selectedTemplate['resources']['resourceItems'];

    let selectedItems = this.resService.renderSelectedItems(fields)
    let searchDefinitions = this.resService.renderSearchCriteriaItems(fields)

    this.state.processing = true;
    this._http._patch('booking/'+this.form.bookingID+'/ReportingOptions',
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      }
    )
      .subscribe(data => {
        this.state.processing=false;
        console.log(data)
      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }

  setResourcesDate () {
    for (let index =0; index<this.state.selectedTemplate['resources'].length; index++) {
      this.state.selectedTemplate['resources'][index]['BeginDate'] = new Date();
      //this.state.selectedTemplate['resources'][index]['BeginDate'].setDate(this.state.selectedTemplate['resources'][index]['BeginDate']);
      this.state.selectedTemplate['resources'][index]['EndDate'] = new Date();
      this.state.selectedTemplate['resources'][index]['errors'] = {'BeginDate': '', 'EndDate': ''}
      this.state.selectedTemplate['resources'][index]['ReturnTimeFormat'] = ''
      this.state.selectedTemplate['resources'][index]['BeginTimeFormat'] = ''
      //this.state.selectedTemplate['resources'][index]['EndDate'].setDate(this.state.selectedTemplate['resources'][index]['EndDate']);
      //alert(this.state.selectedGroup['name'])
      if(this.state.selectedGroup['name'] == 'Templates') {
        this.state.selectedTemplate['resources'][index]['definitions'] = this.state.selectedTemplate['resources'][index].searchFields
        this.loadFields(this.state.selectedTemplate['resources'][index].searchFields, index, -1)
      }
    }
  }

  startBookingSearch () {
    if(this.state.isSearching) return;
    this.state.formErrors['ResourceTypeID'] = '';
    if(!this.form.ResourceTypeID) {
      this.state.formErrors['ResourceTypeID'] = 'Please set Business Profile to continue.';
      this.toastr.error('Please set Business Profile to continue.', 'Error!')
      let element = document.getElementById("businessProfile_container");
      element.scrollIntoView();
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
          let err = error.split('.');
          this.toastr.error(err[0], 'Error!');
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
    console.log(resource.searchFields)
    if(resource.searchFields.length > 0 ){
      for(let index=0; index<resource.searchFields.length; index++){
        let field = resource.searchFields[index];
        fields.push({
          "Relation": field['fieldRelation'],
          "Selection": (typeof field['model'] == 'object' ? field['model']['value'] : field['model']),
          "SelectionText": (typeof field['model'] == 'object' ? field['model']['text'] : field['model']),
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
      //console.log(resource['BeginDate'])
      if(!resource['BeginDate']) {
        resource['errors']['BeginDate'] =  'Begin Date is required field.'
        validated = false;
      }
      //console.log(resource['EndDate'])
      if(!resource['EndDate'] && resource.requiresEndDate) {
        resource['errors']['EndDate'] = 'End Date is required field.';
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

  resetModel (resourceIndex, model) {
    this.state.selectedTemplate['resources'][resourceIndex][model] = '';
    $("#"+model+"_container_"+(resourceIndex+1)).find(".x").trigger('click');
  }

  bindField(event) {
    event = JSON.parse(event);
    console.log(event)

    this.loadFields(this.state.selectedTemplate['resources'][event.resourceIndex].searchFields, event.resourceIndex, event.fieldIndex, (event.fieldType == 'checkbox' ? event : {}));
  }

  loadFields(fields, resourceIndex, fieldIndex, eventData={}) {
    ///api2/booking/{bookingID}/AllSearchCriteriaOptions
    //console.log(JSON.parse(JSON.stringify(fields)))
    console.log(resourceIndex)
    let selectedItems = this.resService.renderSelectedItems(fields)
    //alert(this.state.selectedTemplate['resources'][resourceIndex]['resourceTypeID'])
    let searchDefinitions = this.resService.renderSearchCriteriaItems(fields, this.state.selectedTemplate['resources'][resourceIndex]['resourceTypeID'])
    if(this.state.selectedTemplate['resources'][resourceIndex]['processing']) return;
    this.state.selectedTemplate['resources'][resourceIndex]['processing'] = true;
    this._http._post('booking/'+this.form.bookingID+'/AllSearchCriteriaOptions',
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      }
    )
      .subscribe(data => {
        //console.log(resourceIndex, fields, data)
          this.state.selectedTemplate['resources'][resourceIndex]['processing']=false;
        //console.log(data)
          //this.definition = data;
          this.state.selectedTemplate['resources'][resourceIndex]['searchFields'] = fields
          this.state.selectedTemplate['resources'][resourceIndex]['definitions'] = data;
          //console.log(this.state.selectedTemplate['resources'][resourceIndex].searchFields);

      }, error => {
        console.log(error)
        let message = error.split('.')
        this.toastr.error(message[0], 'Error!')
          this.state.selectedTemplate['resources'][resourceIndex]['processing'] = false;
      },
      ()=>{
        if(fieldIndex<0){
          for(let index=0; index<this.state.selectedTemplate['resources'][resourceIndex].searchFields.length; index++){
            if(!this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].model && this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].results){
              let selectedValue = this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].results.filter(item =>{
                if(item.value == this.state.selectedTemplate['resources'][resourceIndex]['definitions'][index].selectedValue){
                  return item;
                }
              });
              if(selectedValue.length){
                this.state.selectedTemplate['resources'][resourceIndex].searchFields[index].model = selectedValue[0];
              }
            }
          }
        }
          this.getSearchId(this.state.selectedTemplate['resources'][resourceIndex].searchFields, this.state.selectedTemplate['resources'][resourceIndex], resourceIndex, this.state.selectedTemplate['resources'][resourceIndex].resourceTypeID);
        }
      )
  }

  loadFilterData () {

  }
}
