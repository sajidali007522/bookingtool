import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
import {ConfigService} from "../../config.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router:Router,
              private configService: ConfigService) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn() && this.configService.global_permissions['show_home']){
      this.router.navigate(['home'])
    }
    if(this.authService.isLoggedIn() && !this.configService.global_permissions['show_home']) {
      if(this.authService.getDefaultPage()) {
        this.router.navigate([this.authService.getDefaultPage()])
      }
    }
  }

}
