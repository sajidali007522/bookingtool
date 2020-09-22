import {Component, OnInit, Renderer2} from '@angular/core';
import {User} from "../../_models/user";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";

@Component({
  selector: 'app-main',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  categories;
  loading;

  currentUser: User;

  constructor(public router: Router,
              private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    //this.renderer.setAttribute(document.body, 'class', 'menu-fullwidth');
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }
}
