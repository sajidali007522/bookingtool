import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {AuthService as SSOAuth} from "../_services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  constructor(private _http: HttpService,private http: HttpClient, private _auth:AuthService,
              private authService: SSOAuth) { }
  private getHeaders() {
    let headers = new HttpHeaders()
      .set(this._auth.getAuthKey(), this._auth.getToken())
      .set('Authorization', this.authService.getAuthorizationHeaderValue());
    return headers;
  }
  private hitLookup (lookup, params) {
    return this._http._get('lookup/'+lookup, params);
  }

  public loadResources (params={}) {
    return this.hitLookup('AvailabilityResourceType', params)
  }

  public loadSites (params= {}) {
    return this.hitLookup('Site', params)
  }

  public loadBusinessProfile (params={}){
    return this.hitLookup('RuleBag', params)
  }

  public loadContracts (params={}){
    return this.hitLookup('RuleBagContract', params)
  }

  public loadContractSites (params={}){
    return this.hitLookup('ContractSite', params)
  }

  public loadContractorList (params =  {}) {
    return this.hitLookup('RuleBagContractor', params)
  }

  public findResults(bookingId, postBody={}, params={}){
    //console.log(bookingId, postBody, params)
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.post(`${this.baseUrl}booking/${bookingId}/SearchCriteriaOptions`, postBody, {
      headers: this.getHeaders(),
      params: params
    })
  }

}
