import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, Renderer2} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {ConfigService} from "../../config.service";
import {AuthService} from "../../_services/auth.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  isLightTheme;
  isFullWidth;
  language;
  custom_configs;
  userDevice;
  currentUser={};
  page;
  navItems= [];
  constructor( private renderer: Renderer2,
               public router: Router,
               private authService: AuthService,
               private appConfigService: ConfigService,
               private ref: ChangeDetectorRef,
  ) {
    this.custom_configs = this.appConfigService.ui_configs || {};
    this.currentUser = this.authService.getUser();
    this.page = this.router.url
    console.log(this.page);
    //console.log(this.currentUser);
  }

  displayGuestOptions() {
    return !this.authService.isLoggedIn();
  }
  ngAfterViewChecked() {
    this.navItems = this.authService.getModulePermissions();
    $("body").click(function(e){
      if(!$(e.target).is('.children-menu')) {
        $('.header-wrap').find('.dropdown-menu-wrap').hide();
      }
    });
    this.ref.detectChanges()
  }

  ngOnInit(): void {
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
    let noSideBarPages = ['home', 'reservation', 'flight-setup', 'business-profile', 'booking', 'reports']
    let pageChunks = this.router.url.split("/");
    //console.log(this.router.url, pageChunks)
    return noSideBarPages.indexOf(pageChunks[1]) == -1
  }

  showHomePage(){
    return this.authService.isLoggedIn() ? this.authService.getDefaultPage() == '/home' : this.appConfigService.global_permissions['show_home']
  }

  getMenuItems(){
    return this.authService.isLoggedIn() ? this.authService.getModulePermissions() : [];
  }

  showLanguages() {
    return this.authService.isLoggedIn() ? this.authService.getMultiLanguage() : this.appConfigService.global_permissions['multilingual'];
  }

  showUserSettings() {
    return this.authService.isLoggedIn() ? this.authService.getUserSettings() : false
  }

  showUserProfile() {
    return this.authService.isLoggedIn() ? this.authService.userProfile() : false;
  }

  showThemeSwitch() {
    return this.authService.isLoggedIn() ? this.authService.themeSwitch() : this.appConfigService.global_permissions['theme_switch'];
  }

  toggleMenuBar($event) {
    let isVisible = $($event.target).next('ul').is(":visible")

    $($event.target).parents('.header-wrap').find('.dropdown-menu-wrap').hide();
    if(isVisible){
      $($event.target).next('ul').hide();
    }
    else {
      $($event.target).next('ul').show();
    }

  }
  handleMenuBarOnCell($event) {
    if(this.appConfigService['userDevice'] == 'mobile'){
      if($($event.target).next('.dropdown-menu').length == 0) {
        $($event.target).parents('.nav-wrap').find('.navbar-toggler').trigger('click')
      }
    }
    return false
  }



}
