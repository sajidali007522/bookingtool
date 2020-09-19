import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private appConfig: any;
  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return this.http.get('/assets/configs/config.json')
      .toPromise()
      .then(data => {
        console.log(data);
        this.appConfig = data;
      });
  }

  get apiBaseUrl() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.apiBaseUrl ? this.appConfig.apiBaseUrl : '';
  }

  get ui_configs () {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    console.log(this.appConfig.ui_configs);
    return typeof this.appConfig.ui_configs !== 'undefined' ? this.appConfig.ui_configs : {};
  }
}
