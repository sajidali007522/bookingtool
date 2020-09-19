import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private _http: HttpService) { }

  public loadRooms (siteId, params) {
    return this._http._get('housekeeping/'+siteId+'/rooms', params);
  }
}
