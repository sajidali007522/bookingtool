import {Component, OnInit, Renderer2} from '@angular/core';
import {User} from "../../_models/user";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {AuthService} from "../../_services/auth.service";

@Component({
  selector: 'app-main',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  currentUser: User;
  loading= false;
  constructor(public router: Router,
              private authService: AuthService
  ) {

    /*&& !this.authService.canAccessThePage(this.router.url)){
      this.router.navigate([this.authService.getDefaultPage()])
    }*/
    //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    //console.log(this.router.url,  '>>>'+this.authService.getDefaultPage()+'123');
    if((this.router.url == '/home' || this.router.url == '') &&  this.authService.getDefaultPage() != '/home'){
      this.router.navigate([this.authService.getDefaultPage()])
    }
  }

  logout() {
    //this.authenticationService.logout();
    //this.router.navigate(['/auth/login']);
  }
}
