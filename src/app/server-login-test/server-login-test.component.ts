import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-login-test',
  templateUrl: './server-login-test.component.html',
  styleUrls: ['./server-login-test.component.css']
})
export class ServerLoginTestComponent implements OnInit {
  private config = {
    authority: "https://demo.innfinity.com/AngularDev/AuthPortal",
    client_id: "innfinity.angular",
    client_secret: "innfinity.angular",
    redirect_uri: "http://localhost:4200/#/callback",
    response_type: "code",
    scope: "openid innfinity.angular",
    post_logout_redirect_uri: "http://localhost:4200/#/home",
  };
  constructor() { }

  ngOnInit(): void {

  }

}
