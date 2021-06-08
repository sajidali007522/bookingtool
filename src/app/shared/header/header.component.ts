import { Component, OnInit, Renderer2 } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {ConfigService} from "../../config.service";
import {AuthService} from "../../_services/auth.service";


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
  currentUser={};
  page;
  constructor( private renderer: Renderer2,
               public router: Router,
               private authService: AuthService,
               private appConfigService: ConfigService
  ) {
    this.custom_configs = this.appConfigService.ui_configs || {};
    this.currentUser = this.authService.getUser();
    this.page = this.router.url
    //console.log(this.page);
    //console.log(this.currentUser);
  }

  displayGuestOptions() {
    return !this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    //console.log(this.authService.getUser())
    this.switchSkinColor();
    //this.switchContainerWidth();
    this.renderer.removeClass(document.body, 'menu-fullwidth');
    this.isFullWidth = false
    var ua = navigator.userAgent;
    //console.log(ua, window.innerWidth);
    if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua) && window.innerWidth <= 767) {
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

    if($event.x==0 && $event.y == 0 ){ return}
    $event.preventDefault();
    this.isFullWidth = !this.isFullWidth;
    if(this.isFullWidth) {
      this.renderer.addClass(document.body, 'menu-fullwidth');
    } else {
      this.renderer.removeClass(document.body, 'menu-fullwidth');
    }
    $('body').trigger('click')
    return false;
    //localStorage.setItem('container_width', fullWidth ? 'full' : 'no');
    //this.switchContainerWidth();
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
    this.isFullWidth = 'full'; //localStorage.getItem('container_width') || 'no';
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
    this.authService.startLogout()
    //this.router.navigate(['/auth/login']);
  }

  haveSideBar () {
    let noSideBarPages = ['home', 'reservation', 'flight-setup', 'business-profile', 'booking']
    let pageChunks = this.page.split("/");
    //console.log(pageChunks)
    return noSideBarPages.indexOf(pageChunks[1]) == -1
  }

}
