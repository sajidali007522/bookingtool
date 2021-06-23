import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../_services/auth.service";
import {ConfigService} from "../../config.service";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  constructor(public router: Router,
              private authService: AuthService,
              private configService: ConfigService) { }

  ngOnInit(): void {
    console.log(this.authService.getDefaultPage())
    let defaultPage=this.authService.getDefaultPage()
    if(!this.configService.global_permissions['show_home'] && !defaultPage) {
      window.location.href = '/#/login'
      //this.router.navigate(['/login'])
    }
    else if(!this.configService.global_permissions['show_home'] && defaultPage) {
      //window.location.href = '/#'+this.authService.getDefaultPage()
      this.router.navigate([defaultPage])
    }
  }

}
