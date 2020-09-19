import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class HouseKeepingService {

  constructor(private _http: HttpService) { }

  public loadInitialConfig() {
    let params = {}
    return this._http._get('housekeeping/initialconfig', params);
  }

  public loadSiteconfig (siteId, params={featureId : '00000000-0000-0000-0000-000000000000'}) {
    return this._http._get('housekeeping/'+siteId+'/initialconfig', params);
  }
}
