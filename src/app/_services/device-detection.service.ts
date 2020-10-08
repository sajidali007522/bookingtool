import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {

  deviceType = 'desktop'
  constructor(private _http: HttpService) {
    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.deviceType = 'mobile';
    }
    else {
      this.deviceType = 'desktop';
    }
  }

  public isMobile () {
    return this.deviceType == 'mobile'
  }
}
