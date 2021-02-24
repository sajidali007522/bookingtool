import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    //return this.http.get<User[]>(`${config.apiUrl}/users`);
  }

  register(user: User) {
    return this.http.post(`/users/register`, user);
  }

  delete(id: number) {
    //return this.http.delete(`${config.apiUrl}/users/${id}`);
  }

  setCulturalSettings(params){
    localStorage.setItem('settings', JSON.stringify(params))
  }

  getCulturalSettings(){
    let settings = localStorage.getItem('settings');
    if(settings) {
      return JSON.parse(settings)
    }
    return {}
  }

  getSettingByProp(prop){
    let settings = this.getCulturalSettings()
    if(settings){
      return settings[prop];
    }
    return '';
  }
}
