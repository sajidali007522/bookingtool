import { Component } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";

import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'booking-tool';
  categories;
  loading;

  currentUser: User;

  constructor(public router: Router,
              private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.loading = true;
        console.log("event started")
      }else if(event instanceof NavigationEnd) {
        this.loading = false;
        console.log("event end")
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit(): void {

  }


}
