import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import {ConfigService} from "../config.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager = new UserManager(getClientSettings(this.appConfig.sso_config));
  private user: User = null;

  constructor(private appConfig: ConfigService) {
    this.manager.getUser().then(user => {
      this.user = user;
      this.setHeaderPermissions();
    });
  }
  setHeaderPermissions() {
    if(this.isLoggedIn()) {
      let modules = this.appConfig.modules.filter((item) => {
        if (item.isAllowed) {
          return item;
        }
      });
      console.log(modules)
      this.user['modules'] = modules;
      this.user['global_permissions'] = this.appConfig.global_permissions;
      if(modules.length > 0 ){
        this.user['defaultPage'] = modules[0].url;
      }
      if(this.appConfig.global_permissions['show_home']){
        this.user['defaultPage'] = '/home'
      }
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
