import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class FlightSetupService {

  resourceTypes = <any>[]
  constructor(private _http: HttpService) { }

  public loadResourceTypes(params={}) {
    return this._http._get('lookup/ResourceType', params);
  }

  public loadRecords (resourceTypeID, params) {
    return this._http._get(`resource/Items/${resourceTypeID}`, params);
  }

  public getResourceTypeId(resourceType){
    let res = this.resourceTypes.data.results.filter(resource => {
      if(resource.text == resourceType) {
        return resource
      }
    })
    return res[0].value;
  }
}
