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
    return this.http.post( `${this.baseUrl}booking/${bookingId}/Reserve`, body);
  }

}
