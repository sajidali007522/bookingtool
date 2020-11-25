import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class DemoHousekeepingService {

  apiBaseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  apiBaseUrlV2 = 'https://demo.innfinity.com/productsdemo/api2/'
  updateTypeIds = {
    'HkStatus' : '67947EA1-8963-4EE7-A997-90697D12BA9B',
    'AdminStatus' : '1D2F9D74-9C29-4078-BB10-2DED99203043',
    'Housekeeper' : '70715958-92BC-4C3B-AEA5-1563FCAD75CF'
  }
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
    return this.http.patch(this.apiBaseUrl+url, body,{
          params: params,
          headers: headers
        }
      )
  }

  public patchRoom(url, body, params) {
    // /api2/housekeeping/{siteId}/Rooms/{roomId}
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.patch(this.apiBaseUrlV2+url, body,{
        params: params,
        headers: headers
      }
    )
  }

  public deleteRoomImage(url, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.delete(this.apiBaseUrl+url,{
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
