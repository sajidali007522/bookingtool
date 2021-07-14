import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import {ConfigService} from "../config.service";
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService as _AuthService} from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private version='api4';
  private manager = new UserManager(getClientSettings(this.appConfig.sso_config));
  private user: User = null;

  constructor(private appConfig: ConfigService, private userService: UserService, private http: HttpClient,
              private _auth:_AuthService) {
    this.manager.getUser().then(user => {
      this.user = user;
      this.setHeaderPermissions();
    });
  }
  setHeaderPermissions() {
    if(this.isLoggedIn()) {
      let headers = new HttpHeaders()
        .set(this._auth.getAuthKey(), this._auth.getToken())
        .set('Authorization', this.getAuthorizationHeaderValue());
      this.http.get(`${this.appConfig.apiBaseUrl}${this.version}/UserSettings/SiteMap`,{
        headers: headers
      })
        .subscribe((res)=>{
          if(res['status'] == 200) {
            this.user['modules'] = res['data'];
            if (res['data'].length > 0) {
              this.user['defaultPage'] = res['data'][0].link;
            }
          }
          this.user['global_permissions'] = this.appConfig.global_permissions;
          if (this.appConfig.global_permissions['show_home']) {
            this.user['defaultPage'] = '/home'
          }
      });
    }
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    //return `${this.user.token_type} ${this.user.access_token}`;
    return `${this.user.token_type} ${this.generateToken()}`;
  }

  generateToken() {
    return btoa(JSON.stringify(this.user))
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  startLogout() {
    return this.manager.signoutRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      //this.user = user;
      this.user = user;
      this.setHeaderPermissions();
    });
  }
  getUser() {
    return this.user;
  }

  getModulePermissions () {
    //console.log(this.user)
    if(!this.user) return [];
    return this.user['modules'];
  }

  getMultiLanguage() {
    return typeof this.user['global_permissions'] !="undefined" ? this.user['global_permissions']['multilingual'] : false;
  }

  getUserSettings() {
    return typeof this.user['global_permissions'] != "undefined" ? this.user['global_permissions']['user_settings'] : false;
  }

  userProfile() {
    return typeof this.user['global_permissions'] != "undefined" ? this.user['global_permissions']['user_profile'] : false;
  }

  themeSwitch() {
    return typeof this.user['global_permissions'] != "undefined" ? this.user['global_permissions']['theme_switch'] : false;
  }

  getDefaultPage() {
    if (!this.isLoggedIn()) return false;
    return this.user['defaultPage']
  }

  canAccessThePage(url){
    let modules = this.getModulePermissions();
    let isFound = modules.filter(item=>{
      //console.log(item.url, url)
      if(item.url == url){
        return item;
      }
    })
    return isFound.length > 0 ? true : false
  }

}

export function getClientSettings(clientSettings): UserManagerSettings {
  return clientSettings
  /*{
    client_id: "innfinity.angular.localhost4200",
    client_secret: "innfinity.angular.localhos4200",
    response_type: "code",
    scope: "openid innfinity.angular",
    authority: "https://demo.innfinity.com/AngularDev/AuthPortal",
    redirect_uri: "http://localhost:4200/#/callback",
    post_logout_redirect_uri: "http://localhost:4200/#/home",
    silent_redirect_uri: "http://localhost:4200/#/home",
    automaticSilentRenew: true
  };*/
}
