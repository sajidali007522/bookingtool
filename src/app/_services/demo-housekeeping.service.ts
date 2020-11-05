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

  public loadRooms(url, body, params={}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.post(this.apiBaseUrl+"housekeeping/"+url+"/Rooms", body, {
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

  public loadRoomDetails(url, params){
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.apiBaseUrl+url, {
      params: params,
      headers: headers
    })
  }

  public loadRoomImages(url, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.apiBaseUrl+url, {
      params: params,
      headers: headers
    })
  }

  public saveRoom(url, body, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.patch(this.apiBaseUrl+url, {},{
          params: params,
          headers: headers
        }
      )
  }

  public deleteRoomImage(url, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.patch(this.apiBaseUrl+url, {},{
        params: params,
        headers: headers
      }
    )
  }

  public uploadRoomImage(url, body, params={}){
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.post(this.apiBaseUrl+url,
      body,
      {
        params: params,
        headers: headers
      }
      )
  }
}
