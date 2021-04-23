import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {DateParser} from "../_helpers/dateParser";

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceV4 {
  baseUrl = 'https://demo.innfinity.com/productsdemo/api4/'
  state = {
    errorMessages: []
  }
  constructor(
    private _http: HttpService,
    private http: HttpClient,
    private _auth:AuthService,
    private dateParse: DateParser
  ) { }

  public startSession(){
    return this.http.get( `${this.baseUrl}booking/SessionID` );
  }

  public startBooking(sessionId){
    return this.http.get(`${this.baseUrl}Booking/Start`, { params:{sessionID: sessionId}})
  }

  public assignBusinessRule(bookingId, body={}, params={}){
    return this.http.post(`${this.baseUrl}booking/${bookingId}/RuleBag`, body, { params:params})
  }

  public getCriteriaDefinition (bookingID, params){
    return this.http.get(`${this.baseUrl}booking/${bookingID}/SearchCriteriaDefinition`, { params:params})
  }

  public setCriteriaDefinition (bookingID, body, params={}){
    return this.http.patch(`${this.baseUrl}booking/${bookingID}/SearchCriteriaOptions`, body, { params:params})
  }
  ///api4/booking/{bookingID}/SearchCriteriaOption
  public setSearchCriteriaOption (bookingID, body, params={}){
    return this.http.patch(`${this.baseUrl}booking/${bookingID}/SearchCriteriaOptions`, body, { params:params})
  }

  public makeBooking (bookingID, body, params){
    return this.http.post(`${this.baseUrl}booking/${bookingID}/Book`, body, { params:params})
  }

  public getBusinessProfileReporting(bookingID, params){
    return this.http.get(`${this.baseUrl}booking/${bookingID}/Reporting`, { params:params})
  }

  public reportingOptions (bookingID, body, params){
    return this.http.patch(`${this.baseUrl}booking/${bookingID}/ReportingOptions`, body, { params:params})
  }

  public makeSearch(bookingID, body, params){
    return this.http.post(`${this.baseUrl}booking/${bookingID}/Search`, body, { params:params})
  }

  public getSearchResults(bookingID, searchID, searchIndex=0, params={}) {
    return this.http.get( `${this.baseUrl}booking/${bookingID}/Search/${searchID}/${searchIndex}`, {params: params} );
  }

  //Old
  public loadSingleResource (bookingId, params={}) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/TemplateGroups`, {params: params} );
  }

  public saveReservation (bookingId, body, params={}) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/Reporting`, body, {params: params});
  }

  public getReservation (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Reporting`);
  }

  public getReservSkeleton (bookingId, params={}) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Reserve`, {params: params});
  }

  public bookProfile (bookingId, body) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/Reserve`, body);
  }

  public getProfiles(bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/GuestProfiles`, {params:params});
  }

  public setProfile(bookingId, params) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/GuestProfile`, {},{params:params});
  }

  public getProfile(bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/GuestProfile`, {params:params});
  }

  public cloneBooking (bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Clone`, {params:params});
  }

  public isCloneAllBooking (bookingId, params = {}) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/CloneAllBookings`, {params: params});
  }

  public cloneAllBooking (bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/CloneAllBookings`, {params:params});
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
