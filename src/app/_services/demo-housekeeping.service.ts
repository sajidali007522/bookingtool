import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class DemoHousekeepingService {

  apiBaseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  constructor(private http: HttpClient, private _auth:AuthService, private appConfigService: ConfigService) {}

  public loadRooms(url, params={}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.apiBaseUrl+"housekeeping/"+url+"/Rooms", {
      params: params,
      headers: headers
    });
    //  .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  public loadRoom(url, params={}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.apiBaseUrl+url, {
      params: params,
      headers: headers
    });
    //  .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}
