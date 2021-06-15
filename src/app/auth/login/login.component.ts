import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login-component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router:Router) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['home'])
    }
  }

}
