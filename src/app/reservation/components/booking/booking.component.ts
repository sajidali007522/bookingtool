import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TemplateService} from "../../../_services/template.service";
import * as $ from "jquery";
import {ReservationService} from "../../../_services/reservation.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  @ViewChild(ConfirmModalComponent) childcomp: ConfirmModalComponent;

  formFields = <any>[];
  definition = <any>[]
  form = {}
  state={
    processing: false,
    error: {message: ''},
    errorMsg: '',
    bookingID: '',
    searchId: ''
  };

  constructor(
    private _http: HttpService,
    private activatedRoute: ActivatedRoute,
    public template: TemplateService,
    public router: Router,
    public resService: ReservationService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.state.bookingID = params["booking_id"];
    });
    this.getBookingDetails();
  }

  ngAfterViewInit() {
    console.log("view is ready");

    $('body').on('click', '.custom-accordion > h3 > a',  function(e, arg) {
      console.log($(this).attr('class'));
      if( $(this).parent().hasClass('active') ){
        $(this).parent().removeClass('active');
        $(this).parent().next('.custom-accordion-content').slideUp();
      }
      else {
        $(this).parent().addClass('active');
        $(this).parent().next('.custom-accordion-content').slideDown();
      }
      return false;
    });
  }

  getBookingDetails(){
    this.resService.getReservation(this.state.bookingID)
      .subscribe(
        res=>{
          console.log(res)
          //this.router.navigate([`/reservation/${this.state.bookingID}/booking`]);
        },
        error => {
          console.log(error)
        }
      )
  }

  submitForm(){}

}
