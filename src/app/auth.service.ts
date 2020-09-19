import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authKey = 'Innfinity-Subscription-Key';
  private authToken = '82CA6C5B9B4A49A380028CBABC51A4F4';
  constructor() { }

  getToken() {
    return this.authToken
  }

  getAuthKey () {
    return this.authKey;
  }
}
