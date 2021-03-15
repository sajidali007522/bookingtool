import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TemplateService} from "../../../_services/template.service";
import * as $ from "jquery";
import {ReservationService} from "../../../_services/reservation.service";
import {group} from "@angular/animations";
import {LookupService} from "../../../_services/lookupService";
import {ToastrService} from "ngx-toastr";

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
  bookingStructure={}
  canceler;
  keyword= "lastName";

  form = {}
  state={
    processing: false,
    loadingGuest: false,
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
    public resService: ReservationService,
    public lookupService: LookupService,
    private toastr: ToastrService,
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
    $('body').find('.custom-accordion > h3 > a').unbind('click');
    $('body').on('click', '.custom-accordion > h3 > a',  function(e, arg) {
      console.log($(this).parent().attr('class'));
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

  getBookingDetails() {
    if(this.state.processing) return;
    this.state.processing = true;
    this.resService.getReservSkeleton(this.state.bookingID)
      .subscribe(
        res=>{
          this.state.processing=false
          //this.getTravelerList();
          if(res['success']) {
            this.bookingStructure = res['data'];
            this.profiles = [];
            this.profiles.push(res['data']);
            for(let groupIndex = 0; groupIndex<res['data']['inputGroups'].length; groupIndex++) {
              //inputFields loop through fields section
              for(let fieldIndex = 0; fieldIndex<res['data']['inputGroups'][groupIndex]['inputFields'].length; fieldIndex++) {
                if(res['data']['inputGroups'][groupIndex]['inputFields'][fieldIndex].searchField){
                  this.loadFieldOptions(res['data']['inputGroups'][groupIndex]['inputFields'][fieldIndex], fieldIndex, groupIndex);
                }
              }
            }
          }
        },
        error => {
          console.log(error)
        }
      )
  }

  loadFieldOptions(field, fieldIndex, groupIndex){
    field['processing'] = true;
    this.canceler=this.lookupService.findResults(this.state.bookingID, [], {
        definitionType: 2,
        resourceTypeID: '00000000-0000-0000-0000-000000000000',
        searchCriteriaID: field.searchField.searchCriteriaID,
        filter: ''
      })
        .subscribe(
          res=>{
            field['processing'] = false;
            //console.log(res['data'].results)
            if(res['success']) {
              this.profiles[0]['inputGroups'][groupIndex]['inputFields'][fieldIndex]['searchField']['list'] = res['data']['results']
            }

          },
          err=>{
            field['processing'] = false;
            console.log(err)
          }
        )
  }

  addNewProfile(title='', details={}){
    //this.bookingStructure['guestName'] = title;
    let temp = JSON.parse(JSON.stringify(this.bookingStructure));
    temp['guestName'] = title
    this.profiles.push(
      temp
    );
  }

  getloadProfiles (event) {
    let params = {searchTerm: event};
    params['criteria'] = '00000000-0000-0000-0000-000000000000';
    this.travelerList =[];
    this.state.isLoadingTraveler =true;
    if(this.canceler) {this.canceler.unsubscribe();}
    this.canceler = this.resService.getProfiles(this.state.bookingID, params)
      .subscribe(data => {
        if(data['success']) {
          // this.defaultSelection = data['data']['defaultValue'];
          //this.getTravelerList();
          this.travelerList = data['data'];
        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }

  selectTraveler ($event) {
    //console.log($event)
    this.state.isLoadingTraveler = true;
    this.resService.setProfile(this.state.bookingID, {guestProfileID: $event.id})
      .subscribe(data => {
        this.state.isLoadingTraveler = false;
        if(data['status'] == 500){
          let str = data['message'].split('.');
          this.toastr.error(str[0], 'Error!');
        }
        if(data['status'] == 200) {
          // this.defaultSelection = data['data']['defaultValue'];
          this.getBookingDetails();
          //this.addNewProfile((data['data']['firstName']+' '+data['data']['lastName']), data['data']);
        }

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
      });
  }

  getTravelerList (){
    if(this.state.loadingGuest) return;
    this.state.loadingGuest = true;
    this.resService.getProfile(this.state.bookingID, {})
      .subscribe(data => {
        this.state.loadingGuest = false;
        this.state.isLoadingTraveler = false;
        if(data['success'] && data['status'] == 200 && data['data']['firstName'] != '') {
          // this.defaultSelection = data['data']['defaultValue'];
          this.addNewProfile((data['data']['firstName']+' '+data['data']['lastName']), data['data']);
        }


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
      console.log(profile)
      return;
    }
    let body= []
    profile.inputGroups.filter(group=>{
      group.inputFields.filter(field=>{
        body.push({
          relation: field.relation,
          value: field.value
        })
      })
    })
    this.profiles[index]['processing'] = true;
    this.resService.bookProfile(this.state.bookingID, body)
      .subscribe(
        res=>{
          this.profiles[index]['processing'] = false;
          if(res['status'] == 500) {
            let str = res['message'].split('.');
            this.toastr.error(str[0], 'Error!');
          }
          if(res['status'] == 200){
            this.toastr.success("Reservation has been saved", 'Success!');
            this.profiles[index]['resNumber'] = res['data'].resNumber
            this.profiles[index]['reservationID'] = res['data'].reservationID
          }
          //this.router.navigate([`/reservation/${this.state.bookingID}/booking`]);
        },
        error => {
          this.profiles[index]['processing'] = false;
          console.log(error)
        }
      )
  }
  profileValidated(profile){

    let isValidated = true;
    profile.inputGroups.filter(group => {
      group.inputFields.filter(field=>{
        field['errorMessage'] = ""
        if(field.isRequired && field.value == ""){
          isValidated = false;
          field['errorMessage'] = field.name+" is Required"
        }
      })
    })
    return isValidated;
  }

  setValidation (field){
    field.errorMessage = "";
    if(field.isRequired && field.value == ""){
      field['errorMessage'] = field.name+" is Required"
    }
  }
}
