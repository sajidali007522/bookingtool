import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  state = {
    errorMessages: []
  }
  constructor(private _http: HttpService, private http: HttpClient, private _auth:AuthService) { }

  public loadSingleResource (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/TemplateGroups`, );
  }

  public saveReservation (bookingId, body) {
    return this.http.post( `${this.baseUrl}booking/${bookingId}/Reporting`, body);
  }

  public getReservation (bookingId) {
    return this.http.get( `${this.baseUrl}booking/${bookingId}/Reporting`);
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

  public renderSelectedItems (fields) {
    let temp = []
    fields.filter(field=>{
      if(field.isCheckbox){
        if(field.model && typeof field.model.value !== 'undefined') {
          temp.push({
            "relation": (field.fieldRelation|| '00000000-0000-0000-0000-000000000000'),
            "selection": field.model.value,
            "type": (field.type || 0),
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

  public renderSearchCriteriaItems(fields){
    let temp = []
    fields.filter(field=>{
      if(!field.model) {
        field.model = ''
      }
      if(field.isCheckbox && typeof field.model.value != 'undefined'){
        temp.push({
          "resourceTypeID": "00000000-0000-0000-0000-000000000000",
          "searchCriteriaID": field.searchCriteriaID,
          "filter": field.model.value
        })
      } else {
        temp.push({
          "resourceTypeID": "00000000-0000-0000-0000-000000000000",
          "searchCriteriaID": field.searchCriteriaID,
          "filter": (field.model.text ? field.model.text : field.model)
        })
      }

    })
    return temp;
  }

}
