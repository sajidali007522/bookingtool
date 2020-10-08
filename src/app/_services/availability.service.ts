import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  state = {
    errorMessages: []
  }
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

      if(filterParams.siteID.split('00000000-0000-0000-0000-000000000000').join('') == '') {
        this.state.errorMessages.push('Site ID can not be null');
      }

      if(filterParams.businessProfileID.split('00000000-0000-0000-0000-000000000000').join('') == '') {
        this.state.errorMessages.push('Select Business Profile before continue.');
      }

      if(filterParams.contractID.split('00000000-0000-0000-0000-000000000000').join('') == '' && resourceType == 1) {
        this.state.errorMessages.push('Please select Contractor to continue.');
      }

      return false;
    }
    return true;
  }

  resetErrors(){
    this.state.errorMessages = []
  }

  getErrorMessages() {
    return this.state.errorMessages;
  }

  patchAvailabilityRecord (postBody, resourceType) {
    return this._http._patch(`availability/AllotmentsDocumentation/${resourceType}`, postBody);
  }

}
