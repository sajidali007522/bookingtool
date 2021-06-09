import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {AuthService as SSOAuth} from "../_services/auth.service";
import {DateParser} from "../_helpers/dateParser";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  state = {
    errorMessages: []
  }
  constructor(
    private _http: HttpService,
    private http: HttpClient,
    private _auth:AuthService,
    private dateParse: DateParser,
    private authService: SSOAuth
  ) { }
  private getHeaders() {
    let headers = new HttpHeaders()
      .set(this._auth.getAuthKey(), this._auth.getToken())
      .set('Authorization', this.authService.getAuthorizationHeaderValue());
    return headers;
  }

  public loadSingleResource (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/TemplateGroups`,{
      headers: this.getHeaders()
    } );
  }

  public saveReservation (bookingId, body) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/Reporting`, body, {
      headers: this.getHeaders()
    });
  }

  public getReservation (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Reporting`, {
      headers: this.getHeaders()
    });
  }

  public getReservSkeleton (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Reserve`, {
      headers: this.getHeaders()
    });
  }

  public bookProfile (bookingId, body) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/Reserve`, body, {
      headers: this.getHeaders()
    });
  }

  public getProfiles(bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/GuestProfiles`, {
      params:params,
      headers: this.getHeaders()
    });
  }

  public setProfile(bookingId, params) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/GuestProfile`, {},{
      params:params,
      headers: this.getHeaders()
    });
  }

  public getProfile(bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/GuestProfile`, {
      params:params,
      headers: this.getHeaders()
    });
  }

  public cloneBooking (bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Clone`, {
      params:params,
      headers: this.getHeaders()
    });
  }

  public isCloneAllBooking (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/CloneAllBookings`, {
      headers: this.getHeaders()
    });
  }

  public cloneAllBooking (bookingId, params) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/CloneAllBookings`, {
      params:params,
      headers: this.getHeaders()
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
