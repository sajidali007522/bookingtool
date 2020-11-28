import { Injectable } from '@angular/core';
import {HttpService} from "../http.service";

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {

  deviceType = 'desktop'
  constructor(private _http: HttpService) {

  }

  isMobile () {
    var ua = navigator.userAgent;
    console.log(ua);
    if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua) && window.innerWidth <= 767) {
      this.deviceType = 'mobile';
    }
    else {
      this.deviceType = 'desktop';
    }
    return this.deviceType == 'mobile'
  }

  isTablet() {
    var ua = navigator.userAgent;
    return (/iPad|iPod/i.test(ua) && window.innerWidth > 767)
  }
}
