import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {AuthService as SSOAuth} from "../_services/auth.service";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class DemoHousekeepingService {
  private apiVersion='api3/'
  //apiBaseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  //apiBaseUrlV2 = 'https://demo.innfinity.com/productsdemo/api2/'
  updateTypeIds = {
    'HkStatus': '67947EA1-8963-4EE7-A997-90697D12BA9B',
    'AdminStatus': '1D2F9D74-9C29-4078-BB10-2DED99203043',
    'Housekeeper': '70715958-92BC-4C3B-AEA5-1563FCAD75CF'
  }

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private appConfigService: ConfigService,
    private authService: SSOAuth
  ) {
  }

  private getHeaders() {
    let headers = new HttpHeaders()
      .set(this._auth.getAuthKey(), this._auth.getToken())
      .set('Authorization', this.authService.getAuthorizationHeaderValue());
    return headers;
  }

  public loadRooms(url, body, params = {}) {

    return this.http.post(this.appConfigService.apiBaseUrl+this.apiVersion + "housekeeping/" + url + "/Rooms", body, {
      params: params,
      headers: this.getHeaders()
    });
    //  .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  public loadRoom(url, params = {}) {
    //let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.get(this.appConfigService.apiBaseUrl+this.apiVersion + url, {
      params: params,
      headers: this.getHeaders()
    });
    //  .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  public loadRoomDetails(url, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(), this._auth.getToken());
    return this.http.get(this.appConfigService.apiBaseUrl+this.apiVersion + url, {
      params: params,
      headers: this.getHeaders()
    })
  }

  public loadRoomImages(url, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(), this._auth.getToken());
    return this.http.get(this.appConfigService.apiBaseUrl+this.apiVersion + url, {
      params: params,
      headers: this.getHeaders()
    })
  }

  public saveRoom(url, body, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(), this._auth.getToken());
    return this.http.patch(this.appConfigService.apiBaseUrl+this.apiVersion + url, body, {
        params: params,
        headers: this.getHeaders()
      }
    )
  }

  public patchRoom(url, body, params) {
    // /api2/housekeeping/{siteId}/Rooms/{roomId}
    let headers = new HttpHeaders().set(this._auth.getAuthKey(), this._auth.getToken());
    return this.http.patch('api2/' + url, body, {
        params: params,
        headers: this.getHeaders()
      }
    )
  }

  public deleteRoomImage(url, params) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(), this._auth.getToken());
    return this.http.delete(this.appConfigService.apiBaseUrl+this.apiVersion + url, {
        params: params,
        headers: this.getHeaders()
      }
    )
  }

  public uploadRoomImage(url, body, params = {}) {
    let headers = new HttpHeaders().set(this._auth.getAuthKey(), this._auth.getToken());
    return this.http.post(this.appConfigService.apiBaseUrl+this.apiVersion + url,
      body,
      {
        params: params,
        headers: this.getHeaders()
      }
    )
  }
}
