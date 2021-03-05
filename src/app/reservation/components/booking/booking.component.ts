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

  keyword= "firstName";

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
    this.getTravelerList();
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
          this.getBookingDefinitions(res['data'].searchFields);
        },
        error => {
          console.log(error)
        }
      )
  }

  getBookingDefinitions(fields, eventData={}) {
    ///api2/booking/{bookingID}/AllSearchCriteriaOptions
    let selectedItems = this.resService.renderSelectedItems(fields)
    let searchDefinitions = this.resService.renderSearchCriteriaItems(fields)

    this.state.processing = true;
    this._http._patch('booking/'+this.state.bookingID+'/ReportingOptions',
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      }
    )
      .subscribe(data => {
        this.state.processing=false;
        //console.log(data)
        this.formFields = fields;
        this.definition = data;
        if(eventData['fieldType'] == 'checkbox'){
          this.formFields[eventData['fieldIndex']].model = JSON.parse(JSON.stringify(eventData['field'].model));
          if(this.definition[eventData['fieldIndex']].results && eventData['field'].selectedIndex>=0) {
            this.definition[eventData['fieldIndex']].results[eventData['field'].selectedIndex].isChecked = true
          }
        }
      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }



  submitForm(){}

  addNewProfile(title='', details={}){
    this.profiles.push({
      title: (title != '' ? title : '<New Profile>'),
      details: (details? details:{
        title: '',
        first_name: '',
        last_name: '',
        gender: '',
        phone: '',
        email: '',
        vip_number: '',
      })
    });
  }

  getloadProfiles (event) {
    let params = {searchTerm: event};
    params['criteria'] = '00000000-0000-0000-0000-000000000000';
    this.travelerList =[];
    this.state.isLoadingTraveler =true;
    this.resService.getProfiles(this.state.bookingID, params)
      .subscribe(data => {
        if(data['success']) {
          // this.defaultSelection = data['data']['defaultValue'];
          this.getTravelerList();
          this.travelerList = data['data'];
        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }

  selectTraveler ($event) {
    console.log($event)
    this.resService.setProfile(this.state.bookingID, {guestProfileID: $event.id})
      .subscribe(data => {
        if(data['success']) {
          // this.defaultSelection = data['data']['defaultValue'];

        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }

  getTravelerList (){
    this.resService.getProfile(this.state.bookingID, {})
      .subscribe(data => {
        if(data['success'] && data['data']) {
          // this.defaultSelection = data['data']['defaultValue'];
          this.addNewProfile((data['data']['firstName']+' '+data['data']['lastName']), data['data']);
        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
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
    if(!this.profileValidated(profile)){
      return;
    }
    let body= []
    this.definition.filter(field=>{
      body.push({
        value:field.selectedValue,
        relation: (field.fieldRelation|| '00000000-0000-0000-0000-000000000000')
      })
    })

    this.resService.bookProfile(this.state.bookingID, body)
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
  profileValidated(profile){
    return true;
  }
}
