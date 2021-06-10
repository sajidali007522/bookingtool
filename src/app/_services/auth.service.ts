import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {
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

export function getClientSettings(): UserManagerSettings {
  return {
    client_id: "demo_innfinity_com_sodexo_innfinite2-worthydown",
    client_secret: "demo_innfinity_com_sodexo_innfinite2-worthydown",
    response_type: "code",
    scope: "openid profile email upn innfinity.angular",
    authority: "https://demo.innfinity.com/AngularDev/AuthPortal",
    redirect_uri: "https://demo.innfinity.com/Sodexo/innfinite2-worthydown/#/callback",
    post_logout_redirect_uri: "https://demo.innfinity.com/Sodexo/innfinite2-worthydown/#/home",
    silent_redirect_uri: "https://demo.innfinity.com/Sodexo/innfinite2-worthydown/#/home",
    automaticSilentRenew: true
  };
// export function getClientSettings(): UserManagerSettings {
//   return {
//     client_id: "innfinity.angular.dev_innfinity_coddrule",
//     client_secret: "innfinity.angular.dev_innfinity_coddrule",
//     response_type: "code",
//     scope: "openid profile email upn innfinity.angular",
//     authority: "https://demo.innfinity.com/AngularDev/AuthPortal",
//     redirect_uri: "http://dev.innfinity.coddrule.com/#/callback",
//     post_logout_redirect_uri: "http://dev.innfinity.coddrule.com/#/home",
//     silent_redirect_uri: "http://dev.innfinity.coddrule.com/#/home",
//     automaticSilentRenew: true
//   };
  /*return {
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
