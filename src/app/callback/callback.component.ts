import { Component, OnInit } from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  private error;
  constructor(private authService: AuthService,
              public router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService
  ) {
    //Read url query parameter `enter code here`
    this.route.queryParams.subscribe(params => {
      this.error = params['error'];
    });
  }

  ngOnInit(): void {
    if(!this.error) {
      this.authService.completeAuthentication()
        .then(()=>{
          this.router.navigate(['housekeeping'])
        });
      console.log("no error")
    } else {
      console.log("error block")
      this.toastr.error(this.error, 'Error!');

    }
  }
}
