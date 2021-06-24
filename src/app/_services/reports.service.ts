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
export class ReportsService {
  private apiVersion = 'api4/'
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

  public getReports (reportManager, params={}) {
    return this.http.get(`${this.appConfigService.apiBaseUrl}${this.apiVersion}Reporting/${reportManager}`, {
      headers: this.getHeaders(),
      params:params
    })
  }
}
