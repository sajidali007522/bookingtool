import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(private _http: HttpService) { }

  public loadRecords (siteId, contractID, resourceTypeID, params) {
    return this._http._get('availability/'+siteId+'/Allotment/'+contractID+"/"+resourceTypeID, params);
  }
}
