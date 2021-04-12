import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {DateParser} from "../_helpers/dateParser";

@Injectable({
  providedIn: 'root'
})
export class ReservationSearchService {
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  state = {
    errorMessages: []
  }
  constructor(
    private _http: HttpService,
    private http: HttpClient,
    private _auth:AuthService,
    private dateParse: DateParser
  ) { }

  public loadCriteriaDefinition () {
    return this.http.get( `${this.baseUrl}ReservationSearch/CriteriaDefinition`);
  }

  public loadResultDefinition () {
    return this.http.get( `${this.baseUrl}ReservationSearch/ResultDefinition`);
  }

  public makeSearch (params) {
    return this.http.get( `${this.baseUrl}ReservationSearch/Search`, {
      params: params
    });
  }

}
