import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private _http: HttpService) { }

  public hitLookup (lookup, params) {
    return this._http._get('lookup/'+lookup, params);
  }

  public loadResources () {
    return this.hitLookup('ResourceType', {})
  }

  public loadProfiles () {
    return this.hitLookup('RuleBagContract', {})
  }

  public loadContractLists () {
    return this.hitLookup('RuleBagContractor', {})
  }
}
