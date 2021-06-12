import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiVersion = 'api3/';
  baseUrl = 'https://demo.innfinity.com/productsdemo/api3/'
  state = {
    errorMessages: []
  }
  constructor(private _http: HttpService,
              private http: HttpClient,
              private appConfigService: ConfigService,
              private _auth:AuthService) {

  }

  public loadRecords (siteId, contractID, resourceTypeID, contractorId, params) {
    return this._http._get('availability/'+siteId+'/Allotments/'+contractID+"/"+contractorId+"/"+resourceTypeID, params);
  }

  public getAvailabilityType (resourceTypeID) {
    //this.state.filterForm.resourceTypeID
    return this._http._get('availability/'+resourceTypeID+"/AvailabilityType", {});
  }

  public validateFilters (filterParams, resourceType, includeHolds=false) {
    if(filterParams.resourceTypeID.split('00000000-0000-0000-0000-000000000000').join('') == '') {
      this.state.errorMessages.push('Select resource type before continue.');
    }

    if(includeHolds) {
      if (filterParams.contractID.split('00000000-0000-0000-0000-000000000000').join('') == '') {
        this.state.errorMessages.push('Please select Contract to continue.');
      }

    }
    if(filterParams.ContractSite.split('00000000-0000-0000-0000-000000000000').join('') == '' ) {
      this.state.errorMessages.push('Please Select Lodge site to continue.');
    }
    if(
      //filterParams.siteID.split('00000000-0000-0000-0000-000000000000').join('') == '' ||
      filterParams.businessProfileID.split('00000000-0000-0000-0000-000000000000').join('') == '' ||
      ((
        filterParams.contractID.split('00000000-0000-0000-0000-000000000000').join('') == '' ||
        filterParams.ContractSite.split('00000000-0000-0000-0000-000000000000').join('') == '' ))
    ) {

      /*if(filterParams.siteID.split('00000000-0000-0000-0000-000000000000').join('') == '') {
        this.state.errorMessages.push('Site ID can not be null');
      }*/

      if(filterParams.businessProfileID.split('00000000-0000-0000-0000-000000000000').join('') == '') {
        this.state.errorMessages.push('Select Business Profile before continue.');
      }


    }
    //console.log(filterParams);
    if(filterParams.beginDate == null) {
      this.state.errorMessages.push('Begin date can not be empty.');
    }
    if(filterParams.endDate == null) {
      this.state.errorMessages.push('End date can not be empty');
    }
    if(filterParams.beginDate && filterParams.endDate) {
      if (filterParams.beginDate.getTime() > filterParams.endDate.getTime()) {
        this.state.errorMessages.push('End date must be greater than begin date')
      }
    }

    return this.state.errorMessages.length <= 0;

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
    let headers = new HttpHeaders().set(this._auth.getAuthKey(),  this._auth.getToken());
    return this.http.patch(`${this.appConfigService.apiBaseUrl}${this.apiVersion}availability/${siteID}/Allotments/${contractId}/${contractorId}/${resourceType}`, postBody, {
      headers: headers
    });
  }

  loadRoomFeatures (siteID, resourceType) {
    return this._http._get(`availability/${siteID}/RoomPrimaryFeature`);
  }

}
