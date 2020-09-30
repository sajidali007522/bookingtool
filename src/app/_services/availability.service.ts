import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(private _http: HttpService) { }

  public loadRecords (siteId, contractID, resourceTypeID, contractorId, params) {
    return this._http._get('availability/'+siteId+'/Allotments/'+contractID+"/"+contractorId+"/"+resourceTypeID, params);
  }

  public getAvailabilityType (resourceTypeID) {
    //this.state.filterForm.resourceTypeID
    return this._http._get('availability/'+resourceTypeID+"/AvailabilityType", {});
  }
}
