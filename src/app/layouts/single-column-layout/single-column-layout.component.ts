import { Component, OnInit } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {User} from "../../_models/user";

@Component({
  selector: 'app-single-column-layout',
  templateUrl: './single-column-layout.component.html',
  styleUrls: ['./single-column-layout.component.css']
})
export class SingleColumnLayoutComponent implements OnInit {
  currentUser: User;
  loading= false;
  constructor(public router: Router,
              private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    router.events.subscribe((routerEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }

  checkRouterEvent(routerEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
      console.log('navigation started');
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      console.log('navigation end');
      this.loading = false;
    }
  }

}
