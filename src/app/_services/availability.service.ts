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

  public validateFilters (filterParams, resourceType) {
    if(
      filterParams.siteID.split('00000000-0000-0000-0000-000000000000').join('') == '' ||
      filterParams.businessProfileID.split('00000000-0000-0000-0000-000000000000').join('') == '' ||
      (filterParams.contractID.split('00000000-0000-0000-0000-000000000000').join('') == '' && resourceType == 1)
    ) {
      return false;
    }
    return true;
  }
}
