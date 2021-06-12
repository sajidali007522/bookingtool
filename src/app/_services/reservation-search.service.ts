import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {DateParser} from "../_helpers/dateParser";
import {AuthService as SSOAuth} from "./auth.service";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class ReservationSearchService {
  private apiVersion = 'api3/'
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  state = {
    errorMessages: []
  }
  constructor(
    private _http: HttpService,
    private http: HttpClient,
    private _auth:AuthService,
    private dateParse: DateParser,
    private appConfigService: ConfigService
  ) { }

  public loadCriteriaDefinition () {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}ReservationSearch/CriteriaDefinition`);
  }

  public loadResultDefinition () {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}ReservationSearch/ResultDefinition`);
  }

  public makeSearch (params) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}ReservationSearch/Search`, {
      params: params
    });
  }

  public selectReservation(resId, params) {
    return this.http.get( `${this.appConfigService.apiBaseUrl}${this.apiVersion}Reservation/${resId}`,{
      params: params
    });
  }

}
