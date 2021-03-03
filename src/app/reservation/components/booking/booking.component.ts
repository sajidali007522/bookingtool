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
  profileTypeSelected;
  travelerList=[]
  defaultSelection;
  profiles=[]

  keyword= "text";

  form = {}
  state={
    processing: false,
    error: {message: ''},
    errorMsg: '',
    bookingID: '',
    searchId: '',
    isLoadingTraveler:false
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

  addNewProfile(){
    this.profiles.push({
      title: '<New Profile>',
      details: {
        title: '',
        first_name: '',
        last_name: '',
        gender: '',
        phone: '',
        email: '',
        vip_number: '',
      }
    });
  }

  getloadProfiles (event) {
    let params = {searchTerm: event};
    params['criteria'] = '00000000-0000-0000-0000-000000000000';
    this.travelerList =[];
    this.state.isLoadingTraveler =true;
    this._http._get("lookup/ProfileLookupSearch", params)
      .subscribe(data => {
        this.defaultSelection = data['data']['defaultValue'];
        this.travelerList = data['data']['results'];
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }
  selectTraveler ($event) {

  }
  searchCleared(type) {
    this.travelerList =[];
  }
  onFocused(e){
    // do something when input is focused
  }
  removeProfile(index){
    this.profiles.splice(index, 1)
  }

  bookProfile(index, profile){
    this.resService.bookProfile(this.state.bookingID, [])
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
}
