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

  public loadSites (params= {}) {
    return this.hitLookup('Site', params)
  }

  public loadBusinessProfile (params={}){
    return this.hitLookup('RuleBag', params)
  }

  public loadContracts (params={}){
    return this.hitLookup('RuleBagContract', params)
  }

  public loadContractSites (params={}){
    return this.hitLookup('ContractSite', params)
  }

  public loadContractorList (params =  {}) {
    return this.hitLookup('RuleBagContractor', params)
  }

}
