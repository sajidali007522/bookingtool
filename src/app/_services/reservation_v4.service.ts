import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {AuthService as SSOAuth} from "../_services/auth.service";
import {DateParser} from "../_helpers/dateParser";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceV4 {
  private apiVersion = 'api4/'
  baseUrl = 'https://demo.innfinity.com/productsdemo/api4/'
  state = {
    errorMessages: []
  }
  constructor(
    private _http: HttpService,
    private http: HttpClient,
    private _auth:AuthService,
    private dateParse: DateParser,
    private authService: SSOAuth,
    private appConfigService: ConfigService
  ) { }

  private getHeaders() {
    let headers = new HttpHeaders()
      .set(this._auth.getAuthKey(), this._auth.getToken())
      .set('Authorization', this.authService.getAuthorizationHeaderValue());
    return headers;
  }

  public startSession(){
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/SessionID`,{
      headers: this.getHeaders()
    } );
  }

  public startBooking(sessionId){
    return this.http.get(`${this.appConfigService.apiBaseUrl}${this.apiVersion}Booking/Start`, {
      headers: this.getHeaders(),
      params:{sessionID: sessionId}
    })
  }

  public assignBusinessRule(bookingId, body={}, params={}){
    return this.http.post(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/RuleBag`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public getCriteriaDefinition (bookingID, params){
    return this.http.get(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/SearchCriteriaDefinition`, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public setCriteriaDefinition (bookingID, body, params={}){
    return this.http.patch(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/SearchCriteriaOptions`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }


  ///api4/booking/{bookingID}/SearchCriteriaOption
  public setSearchCriteriaOption (bookingID, body, params={}){
    return this.http.patch(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/SearchCriteriaOptions`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }

  ////api4/booking/{bookingID}/ReserveOptions
  public getReserveOption (bookingID, body, params={}){
    return this.http.patch(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/ReserveOptions`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public makeBooking (bookingID, body, params){
    return this.http.post(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Book`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public getBusinessProfileReporting(bookingID, params){
    return this.http.get(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Reporting`, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public reportingOptions (bookingID, body, params){
    return this.http.patch(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/ReportingOptions`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public makeSearch(bookingID, body, params){
    return this.http.post(`${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Search`, body, {
      headers: this.getHeaders(),
      params:params
    })
  }

  public getSearchResults(bookingID, searchID, searchIndex=0, params={}) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Search/${searchID}/${searchIndex}`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  public getSearchStatus(bookingID, searchID, params={}) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Search/${searchID}`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public renderFilterGrid(bookingID, searchID, searchIndex, columnKey, rowKey, params={}) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/SearchFilterGrid/${searchID}/${searchIndex}/${columnKey}/${rowKey}`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  public getSortFields(bookingID, searchID, searchIndex=0, params={}){
    ///api4/booking/{bookingID}/Search/{searchID}/{searchIndex}/SortFields
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Search/${searchID}/${searchIndex}/SortFields`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public getSearchCriteriaForResource (bookingID, resourceTypeID, params={}) {
    ///api4/booking/{bookingID}/SearchCriteriaDefinition/{resourceTypeID}
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/SearchCriteriaDefinition/${resourceTypeID}`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public bookResource (bookingID, body, params={}) {
    ///api4/booking/{bookingID}/SearchCriteriaDefinition/{resourceTypeID}
    return this.http.post( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingID}/Book`, body, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public getBookedSegments(bookingId, params={}){
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/BookedSegments`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public loadAddableResourceTypes(bookingId, params){
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/AddableResourceTypes`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public loadCriteriaDefinitions(bookingId, resourceTypeID, params){
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/AddableResourceTypes/SearchCriteriaDefinition/${resourceTypeID}`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  //Old
  public loadSingleResource (bookingId, params={}) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/TemplateGroups`, {
      headers: this.getHeaders(),
      params: params
    } );
  }

  public saveReservation (bookingId, body, params={}) {
    return this.http.post( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/Reporting`, body, {
      headers: this.getHeaders(),
      params: params
    });
  }

  public getReservation (bookingId) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/Reporting`,{
      headers: this.getHeaders()
    });
  }

  public getReservSkeleton (bookingId, params={}) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/Reserve`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  public bookProfile (bookingId, body, params={}) {
    return this.http.post( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/Reserve`, body, {
      headers: this.getHeaders(),
      params: params
    });
  }

  public getProfiles(bookingId, params) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/GuestProfiles`, {
      headers: this.getHeaders(),
      params:params
    });
  }

  public setProfile(bookingId, params) {
    return this.http.post( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/GuestProfile`, {},{
      headers: this.getHeaders(),
      params:params
    });
  }

  public getProfile(bookingId, params) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/GuestProfile`, {
      headers: this.getHeaders(),
      params:params
    });
  }

  public cloneBooking (bookingId, params) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/Clone`, {
      headers: this.getHeaders(),
      params:params
    });
  }

  public isCloneAllBooking (bookingId, params = {}) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/CloneAllBookings`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  public cloneAllBooking (bookingId, params) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}booking/${bookingId}/CloneAllBookings`, {
      headers: this.getHeaders(),
      params:params
    });
  }

  public renderSelectedItems (fields, type=0) {
    let temp = []
    fields.filter(field=>{
      if(field.isCheckbox){
        if(field.model && typeof field.model.value !== 'undefined') {
          temp.push({
            "relation": (field.fieldRelation|| '00000000-0000-0000-0000-000000000000'),
            "selection": field.model.value,
            "type": (type || (field.type || 0)),
            "selectionText": field.model.value
          })
        }
      } else {
        if(field.model) {
          temp.push({
            "relation": (field.fieldRelation|| '00000000-0000-0000-0000-000000000000'),
            "selection": (typeof field.model.value !== 'undefined' ? field.model.value : field.model),
            "type": (field.type || 0),
            "selectionText": (typeof field.model.text !== 'undefined' ? field.model.text : field.model)
          })
        }
      }


    })
    return temp;
  }

  public renderSearchCriteriaItems(fields, resourceId= '00000000-0000-0000-0000-000000000000'){
    let temp = []
    fields.filter(field=>{
      if(!field.model) {
        field.model = ''
      }
      if(field.isCheckbox && typeof field.model.value != 'undefined'){
        temp.push({
          "resourceTypeID": resourceId,
          "searchCriteriaID": field.searchCriteriaID,
          "filter": field.model.value
        })
      } else {
        temp.push({
          "resourceTypeID": resourceId,
          "searchCriteriaID": field.searchCriteriaID,
          "filter": (field.model.text ? field.model.text : field.model)
        })
      }

    })
    return temp;
  }

  public prepareBody(resource, resourceTypeID, fields){
    let isReturn = false;
    resource.resourceItems.filter(item => {
      if(!isReturn){
        isReturn = item.isReturn || false
      }
    });
    let beginDate = this.dateParse.parseDate(resource['BeginDate']);

    let returnBody = {
      "isReturn": isReturn,
      "selectedItems": fields,
      "beginDate": beginDate,
      "endDate": beginDate,
      "searchIndeces": [
        0
      ]
    };
    if(resource.requiresEndDate){
      let endDate = this.dateParse.parseDate(resource['EndDate']);
      returnBody['endDate'] = endDate
    }

    if(resource.canSearchByTime){
      let beginTime = this.dateParse.parseDateToTime(resource['BeginTime']);
      returnBody['beginTime'] = beginTime
    }
    if(resource.canSearchByTime && resource.requiresEndDate){
      let endTime = this.dateParse.parseDateToTime(resource['EndTime']);
      returnBody['endTime'] = endTime
    }

    return {
      "resourceTypeID": resourceTypeID,
      "criteria": [returnBody]
    };


  }
}
