import { Component, OnInit, Renderer2 } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {ConfigService} from "../../config.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLightTheme;
  isFullWidth;
  language;
  custom_configs;
  userDevice;

  constructor( private renderer: Renderer2,
               public router: Router,
               private authenticationService: AuthenticationService,
               private appConfigService: ConfigService
  ) {
    this.custom_configs = this.appConfigService.ui_configs || {};
  }

  ngOnInit(): void {
    this.switchSkinColor();
    this.switchContainerWidth();
    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.appConfigService['userDevice'] = 'mobile';
    }
    else {
      this.appConfigService['userDevice'] = 'desktop';
    }
  }

  setTheme ($event, theme='dark') {
    $event.preventDefault();
    localStorage.setItem('theme', theme);
    this.switchSkinColor();
  }

  setWidth ($event, fullWidth=false) {
    $event.preventDefault();
    localStorage.setItem('container_width', fullWidth ? 'full' : 'no');
    this.switchContainerWidth();
  }

  setLocale ($event, language = 'en') {
    $event.preventDefault();
    localStorage.setItem('language', language);
    this.switchLanguage();
  }

  switchLanguage () {
    this.language = localStorage.getItem('language');
  }

  switchContainerWidth () {
    this.isFullWidth = localStorage.getItem('container_width') || 'no';
    this.renderer.removeClass(document.body, 'menu-fullwidth')
    if(this.isFullWidth === 'full') {
      this.renderer.addClass(document.body, 'menu-fullwidth');
    }
  }

  switchSkinColor () {
    this.isLightTheme = localStorage.getItem('theme');
    if(!this.isLightTheme) {
      this.isLightTheme = 'theme-dark';
    }
    this.renderer.setAttribute(document.body, 'class', '');
    this.renderer.addClass(document.body, this.isLightTheme);

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }

}
