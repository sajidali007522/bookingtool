import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private _http: HttpService) { }

  private hitLookup (lookup, params) {
    return this._http._get('lookup/'+lookup, params);
  }

  public loadResources (params={}) {
    return this.hitLookup('ResourceType', params)
  }

  public loadProfiles (params={}) {
    return this.hitLookup('RuleBagContract', params)
  }

  public loadContractLists (params={}) {
    return this.hitLookup('RuleBagContractor', params)
  }

  public loadSites (params= {}) {
    return this.hitLookup(('Site'), params)
  }
}
