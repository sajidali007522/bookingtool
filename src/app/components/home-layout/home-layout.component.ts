import {AfterViewChecked, Component, OnInit, Renderer2} from '@angular/core';
import {User} from "../../_models/user";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {AuthService} from "../../_services/auth.service";
import {ConfigService} from "../../config.service";

@Component({
  selector: 'app-main',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit,AfterViewChecked {
  currentUser: User;
  loading= false;
  constructor(public router: Router,
              private authService: AuthService,
              private configService: ConfigService
  ) {

    /*&& !this.authService.canAccessThePage(this.router.url)){
      this.router.navigate([this.authService.getDefaultPage()])
    }*/
    //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    //console.log(this.router.url,  '>>>'+this.authService.getDefaultPage()+'123');
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

  ngAfterViewChecked() {


  }

  logout() {
    //this.authenticationService.logout();
    //this.router.navigate(['/auth/login']);
  }
}
