import { Component, OnInit } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {User} from "../../_models/user";
import {AuthService} from "../../_services/auth.service";
import {ConfigService} from "../../config.service";

@Component({
  selector: 'app-single-column-layout',
  templateUrl: './single-column-layout.component.html',
  styleUrls: ['./single-column-layout.component.css']
})
export class SingleColumnLayoutComponent implements OnInit {
  currentUser: User;
  loading= false;
  constructor(public router: Router,
              private authService: AuthService
  ) {
    //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    router.events.subscribe((routerEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  ngOnInit(): void {
    //alert(this.router.url)
    //console.log(this.router.url,  this.authService.getDefaultPage()+'456');
    if(!this.authService.canAccessThePage(this.router.url)) {
      this.router.navigate([this.authService.getDefaultPage()])
    }
  }

  logout() {
    //this.authenticationService.logout();
    //this.router.navigate(['/auth/login']);
  }

  checkRouterEvent(routerEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
      console.log(this.router.url)
      console.log('navigation started');
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      console.log(this.router.url)
      console.log('navigation end');
      this.loading = false;
    }
  }

}
