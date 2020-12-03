import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  state = {
    errorMessages: []
  }
  constructor(private _http: HttpService, private http: HttpClient) { }

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
      ((
        filterParams.contractID.split('00000000-0000-0000-0000-000000000000').join('') == '' ||
        filterParams.ContractSite.split('00000000-0000-0000-0000-000000000000').join('') == '' ) && resourceType == 1)
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

      if(filterParams.ContractSite.split('00000000-0000-0000-0000-000000000000').join('') == '' && resourceType == 1) {
        this.state.errorMessages.push('Please Select Lodge site to continue.');
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

  patchAvailabilityRecord (postBody, siteID, contractId, contractorId, resourceType) {
    ///api2/availability/{siteID}/Allotments/{contractID}/{contractorID}/{resourceTypeID}
    ///api3/availability/{siteID}/Allotments/{contractID}/{contractorID}/{resourceTypeID}
    return this.http.patch(`${this.baseUrl}availability/${siteID}/Allotments/${contractId}/${contractorId}/${resourceType}`, postBody);
  }

  loadRoomFeatures (siteID, resourceType) {
    return this._http._get(`availability/${siteID}/RoomPrimaryFeature`);
  }

}
