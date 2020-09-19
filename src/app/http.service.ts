import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import { HttpClient } from '@angular/common/http';
import { CONFIGS} from "../assets/configs/config";
import {ConfigService} from "./config.service";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private _auth:AuthService, private appConfigService: ConfigService) {}

  public _get(url, params={}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.appConfigService.apiBaseUrl+url, {
      params: params,
      headers: headers
    });
    //  .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  public _post(url, body, params={}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.post(this.appConfigService.apiBaseUrl+url, body, {
      params: params,
      headers: headers
    });
    //  .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  public _delete(url, params={}){
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.delete(this.appConfigService.apiBaseUrl+url, {
      params: params,
      headers: headers
    });
  }

  public _patch(url, body={}, params={}){
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.patch(this.appConfigService.apiBaseUrl+url, body, {
      params: params,
      headers: headers
    });
  }

  public _getApi (url, params={}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.appConfigService.apiBaseUrl, {
      params: params,
      headers: headers
    });
     // .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}
