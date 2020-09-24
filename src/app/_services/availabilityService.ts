import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(private _http: HttpService) { }

  public hitLookup (lookup, params) {
    return this._http._get('lookup/'+lookup, params);
  }
}
