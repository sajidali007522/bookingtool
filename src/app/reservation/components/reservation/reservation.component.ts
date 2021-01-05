import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {DateFormatsService} from "../../../_services/date-formats.service";
import {HttpService} from "../../../http.service";
import {Router} from "@angular/router";
import * as $ from 'jquery';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit,AfterViewInit {
  public isLoadingResult;
  public isLoadingArrival;
  public isLoadingTraveler;
  public error;
  public remoteData;
  public errorMsg;
  public defaultSelection;
  public selectedObject;
  public businessProfiles;
  public profileTypeSelected;
  public loadingTravelerList;
  public travelerList;
  private apiEndPoint;

  arrivalList;
  departureList;
  keyword="text";
  tab = 'flight';
  bsConfig: Partial<BsDatepickerConfig>;
  chosenDateFormat;
  minDateFrom: Date;
  minDateTo: Date;
  dateFormats;
  ruleBags;
  state={
    initiateBooking: false,
    processing:false,
    errors: ''
  };
  form = {
    BeginDate: new Date(),
    EndDate: new Date(),
    BeginTime: '',
    EndTime: '',
    IsReturn: false,
    tripType: 1,
    ResourceTypeID: "ECF6F1A3-8867-40CC-8118-5DEFB120D5EE",
    TimePropertyID: "00000000-0000-0000-0000-000000000000",
    SearchIndex: 0,
    SelectedItems: [],
    bookingID: '',
    hotelName: '',
    hotelChain: ''
  };
  constructor(private DFService: DateFormatsService,
              private _http: HttpService,
              private router: Router
  ) {
    this.apiEndPoint='CommercialAirportSearch';
    this.bsConfig = { containerClass: 'theme-dark-blue', isAnimated: true }
    this.dateFormats = this.DFService.dateFormats;
    this.form.BeginDate = new Date();
    this.form.BeginDate.setDate(this.form.BeginDate.getDate());
    this.form.EndDate = new Date();
    this.form.EndDate.setDate(this.form.EndDate.getDate()+1);
  }

  ngOnInit(): void {
    this.StartBooking();
  }

  ngAfterViewInit() {

    $("ng-autocomplete input[type='text']").on('blur', (event) => {
      //console.log($(event.target).parents('ng-autocomplete')) //.attr('name'));
      this.selectDefaultValue($(event.target).parents('ng-autocomplete').attr('name'));
    });

  }

  onFocused(e){
    // do something when input is focused
  }

  setDateTo () {
    this.form.EndDate = this.form.BeginDate;
  }

  setDepartureDate () {
    if(this.form.BeginDate > this.form.EndDate) {
      this.form.BeginDate = this.form.EndDate;
    }
  }


  applyFormat (dp) {
    this.bsConfig = Object.assign(this.bsConfig, { dateInputFormat: this.chosenDateFormat });
  }

  setTripType(type){
    switch (type) {
      case 1:
          this.form.IsReturn = false;
        break;
      case 2:
        this.form.IsReturn = true;
        break;
      case 3:
        break;
    }
  }
  submitIt () {
    let postBody = this.preparePostBody();
    this.state.errors = '';
    this.state.processing = true;
    this._http._post("Booking/"+this.form.bookingID+"/SearchCriteria", postBody)
      .subscribe(data => {
        this.state.processing=false;
        this.getSearchCriteria(data);
        //this.router.navigate(['/reservation/'+this.form.bookingID+'/search/'+data['resourceTypeID']]);
      },
        error => {
        console.log(error);
          this.state.processing=false;
          this.state.errors = error;
        });
  }

  preparePostBody () {
    let departure = new Date(this.form.BeginDate);
    let arrival = new Date(this.form.EndDate);
    let departureTime = new Date(this.form.BeginTime);
    let arrivalTime = new Date(this.form.EndTime);
    //console.log(departureTime.getTime(), isNaN(departureTime.getHours()) , typeof departureTime);
    let postBody = [];

    //if roundTrip
    if(this.form.IsReturn) {
      postBody.push({
        BeginDate: departure.getFullYear()+'-'+(departure.getMonth()+1)+"-"+departure.getDate(),
        EndDate: departure.getFullYear()+'-'+(departure.getMonth()+1)+"-"+departure.getDate(),
        BeginTime: !isNaN(departureTime.getHours()) ? departureTime.getHours()+":"+departureTime.getMinutes() : '',
        EndTime: !isNaN(departureTime.getHours()) ? departureTime.getHours()+":"+departureTime.getMinutes() : '',
        IsReturn: false,
        ResourceTypeID: this.form.ResourceTypeID,
        TimePropertyID: this.form.TimePropertyID,
        SearchIndex: 0,
        SelectedItems: this.form.SelectedItems
      });
      postBody.push({
        BeginDate: arrival.getFullYear()+'-'+(arrival.getMonth()+1)+"-"+arrival.getDate(),
        EndDate: arrival.getFullYear()+'-'+(arrival.getMonth()+1)+"-"+arrival.getDate(),
        BeginTime: !isNaN(arrivalTime.getHours()) ? arrivalTime.getHours()+":"+departureTime.getMinutes() : '',
        EndTime: !isNaN(arrivalTime.getHours()) ? arrivalTime.getHours()+":"+departureTime.getMinutes() : '',
        IsReturn: this.form.IsReturn,
        ResourceTypeID: this.form.ResourceTypeID,
        TimePropertyID: this.form.TimePropertyID,
        SearchIndex: 0,
        SelectedItems: this.form.SelectedItems
      })
    } else {
      postBody.push({
        BeginDate: departure.getFullYear()+'-'+(departure.getMonth()+1)+"-"+departure.getDate(),
        EndDate: arrival.getFullYear()+'-'+(arrival.getMonth()+1)+"-"+arrival.getDate(),
        BeginTime: !isNaN(departureTime.getHours()) ? departureTime.getHours()+":"+departureTime.getMinutes() : '',
        EndTime: !isNaN(arrivalTime.getHours()) ? arrivalTime.getHours()+":"+departureTime.getMinutes() : '',
        IsReturn: this.form.IsReturn,
        ResourceTypeID: this.form.ResourceTypeID,
        TimePropertyID: this.form.TimePropertyID,
        SearchIndex: 0,
        SelectedItems: this.form.SelectedItems
      });
    }
    return postBody;
  }
  getSearchCriteria (assignSearchResponse){
    this.state.errors= '';
    this.state.processing=true;
    this._http._post('Booking/'+this.form.bookingID+'/SearchCriteria', Array.of({}), {
        retrieve : true,
        resourceTypeID: assignSearchResponse['resourceTypeID']
      }
    )
      .subscribe(data => {
        this.state.processing=false;
        window.localStorage.setItem('resources', JSON.stringify(data));
        this.loadSearchResult(data, assignSearchResponse['resourceTypeID']);
      },
        error => {
          this.state.processing=false;
          this.state.errors = error;
        })
  }

  loadSearchResult (requestParams, resourceTypeId) {
    this.state.processing=true;
    let body = {
      "ResourceTypeID": resourceTypeId,
      "Criteria": []
    }
    for (let index= 0; index < requestParams['resources'].length; index++){
      let departure = new Date(requestParams['resources'][index].resourceItems[0].beginDate);
      let arrival = new Date(requestParams['resources'][index].resourceItems[0].endDate);
      let departureTime = new Date(requestParams['resources'][index].resourceItems[0].beginTime);
      let arrivalTime = new Date(requestParams['resources'][index].resourceItems[0].endTime);
      body.Criteria.push({
        "IsReturn": false,
        "BeginDate": departure.getFullYear()+'-'+(departure.getMonth()+1)+"-"+departure.getDate(),
        "EndDate": arrival.getFullYear()+'-'+(arrival.getMonth()+1)+"-"+arrival.getDate(),
        "BeginTime": !isNaN(departureTime.getHours()) ? departureTime.getHours()+":"+departureTime.getMinutes() : null,
        "EndTime": !isNaN(arrivalTime.getHours()) ? arrivalTime.getHours()+":"+departureTime.getMinutes() : null,
        "SelectedItems": [
          {
            "Relation": requestParams['resources'][index].searchFields[0].fieldRelation,
            "Selection": requestParams['resources'][index].searchFields[0].defaultValue,
            "SelectionText": requestParams['resources'][index].searchFields[0].defaultText,
            "Type": requestParams['resources'][index].searchFields[0].type
          },
          {
            "Relation": requestParams['resources'][index].searchFields[1].fieldRelation,
            "Selection": requestParams['resources'][index].searchFields[1].defaultValue,
            "SelectionText": requestParams['resources'][index].searchFields[1].defaultText,
            "Type": requestParams['resources'][index].searchFields[1].type
          }
        ],
        "SearchIndeces": [0]
      })
    }
    this._http._post('Booking/'+this.form.bookingID+'/Search', body, {waitForSearchToComplete:true})
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['/reservation/'+this.form.bookingID+'/search/'+data['searchID']]);
      })
  }

  getServerResponse(event, searchType='departure-list') {
    this.error = {};
    if(searchType == 'departure-list') {
      this.isLoadingResult = true;
    } else {
      this.isLoadingArrival = true;
    }
    let params = {searchTerm: event};

    this._http._get("lookup/"+this.apiEndPoint, params)
      .subscribe(data => {
        if (data['data']['results'] == undefined) {
          this.remoteData = [];
          this.errorMsg = data['Error'];
        } else {
          this.defaultSelection = data['data']['defaultValue'];
          if(searchType == 'departure-list') {
            this.departureList = data['data']['results'];
          } else {
            this.arrivalList = data['data']['results'];
          }
        }
        this.isLoadingResult = false;
        this.isLoadingArrival = false;
      },error => {
        this.error = error;
        this.isLoadingResult = false;
        this.isLoadingArrival = false;
      });
  }

  selectTraveler ($event) {

  }

  getloadProfiles (event) {
    let params = {searchTerm: event};
    params['criteria'] = this.profileTypeSelected;
    this.travelerList =[];
    this.isLoadingTraveler =true;
    this._http._get("lookup/ProfileLookupSearch", params)
      .subscribe(data => {
          this.defaultSelection = data['data']['defaultValue'];
          this.travelerList = data['data']['results'];
          this.isLoadingTraveler = false;

      },error => {
        this.error = error;
        this.isLoadingTraveler = false;
      });
  }

  selectDefaultValue (fieldName) {
    if(!fieldName || !this.defaultSelection) return;
    let remoteContent = [];
    if(fieldName == 'traveler') {
      remoteContent = Object.assign([], this.travelerList);
      this.travelerList = [];
    }
    if(fieldName == 'departure') {
      remoteContent = Object.assign([], this.departureList);
      this.departureList = [];
    }
    if(fieldName == 'arrival') {
      remoteContent = Object.assign([], this.arrivalList);
      this.arrivalList = [];
    }
    for(let index = 0; index < remoteContent.length; index++) {
      if(this.defaultSelection == remoteContent[index].value) {
        //this.selectedObject = remoteContent[index];
        if(fieldName == 'traveler') {  }
        if(fieldName == 'departure') {
          this.selectDeparture(remoteContent[index]);
        }
        if(fieldName == 'arrival') {
          this.selectArrival(remoteContent[index]);
        }
        $(document).find("ng-autocomplete[name='"+fieldName+"'] input[type='text']").val(remoteContent[index].text);
        break;
      }
    }

  }

  selectEvent(item) {
    // do something with selected item
    this.selectedObject = item;
  }

  selectDeparture (item) {
    let selection = {};
    selection['Type'] = this.getLocationType();
    selection["Selection"]= item.value;
    selection["SelectionText"] =  item.text;
    switch (this.form.tripType) {
      case 1:
        selection["Relation"] = "DepartureAirport"
        this.form.SelectedItems[0] = selection;
        break;
      case 2:
        selection["Relation"] = "DepartureAirport"
        this.form.SelectedItems[0] = selection;
        break;
      case 3:
        break;
      default:
        this.form.SelectedItems.push(selection);
        break;
    }
  }

  getLocationType () {
    let type = 0;
    switch (this.tab) {
      case 'flight':
        type = 1;
        break;
      default:
        break;
    }
    return type;
  }

  selectArrival (item) {
    let selection = {};
    selection['Type'] = this.getLocationType();
    selection["Selection"]= item.value;
    selection["SelectionText"] =  item.text;
    switch (this.form.tripType) {
      case 1:
        selection["Relation"] = "ArrivalAirport"
        this.form.SelectedItems[1] = selection;
        break;
      case 2:
        selection["Relation"] = "ArrivalAirport"
        this.form.SelectedItems[1] = selection;
        break;
      case 3:
        break;
      default:
        this.form.SelectedItems.push(selection);
        break;
    }
  }

  searchCleared(type) {
    if(type == 'departure-list') {
     this.departureList = []
    }
    else if (type == 'departure-list') {
      this.arrivalList = []
    }
    else {
      this.remoteData = [];
    }
  }

  setSearchParams (tab) {
    this.tab = tab;
    this.setApiEndPoint(tab);
  }

  private setApiEndPoint(tab) {
    switch (tab) {
      case 'flight':
        this.apiEndPoint = 'CommercialAirportSearch';
        break;
      case 'hotel':
        this.apiEndPoint = 'LocationSearch';
        break;
      case 'car':
        this.apiEndPoint = 'ProfileLookupSearch';
        break;
      case 'bundle':
        this.apiEndPoint = 'CommercialAirportSearch';
        break;
      default:
        this.apiEndPoint = 'CommercialAirportSearch';
        break;
    }
  }

  StartBooking () {
    this.state.initiateBooking=true;
    this._http._get("Booking/Start")
      .subscribe(data => {
        console.log(data);
        if(data['ruleBags']) {
          this.ruleBags = data['ruleBags'];
        }
        if(data['bookingID']) {
          this.form.bookingID = data['bookingID'];
        }
        this.state.initiateBooking = false;
      });
  }

  loadBusinessProfiles () {
    //https://demo.innfinity.com/productsdemo/api2/lookup/ProfileTypeLookupSearch
      this._http._get("lookup/ProfileTypeLookupSearch")
        .subscribe(data => {
          this.businessProfiles = data['data']['results'];
        });
  }
}
