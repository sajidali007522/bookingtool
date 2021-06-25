import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'booking-tool';
  loading;

  constructor(public router: Router
  ) {
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.loading = true;
        console.log("event started")
      }else if(event instanceof NavigationEnd) {
        this.loading = false;
        if(['callback', 'server-login', 'login', 'logout'].indexOf(this.router.url) == -1) {
          window.localStorage.setItem('last_visited', this.router.url)
        }
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
