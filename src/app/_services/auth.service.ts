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
    });
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
      this.user = user;
    });
  }
  getUser(){
    return this.user;
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
