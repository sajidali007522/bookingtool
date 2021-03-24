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
  keyword= "lastDashFirst";
  isCloneAll = false

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
    this.state.processing=true;
    this.resService.isCloneAllBooking(this.state.bookingID).subscribe(res=>{
      this.state.processing=false;
      if(res['success']) {
        this.isCloneAll = res['data']
      }
      this.getBookingDetails();
    })

  }

  ngAfterViewInit() {
    //console.log("view is ready");
    $('body').find('.custom-accordion > h3 > a').unbind('click');
    $('body').on('click', '.custom-accordion > h3 > a',  function(e, arg) {
      if($(this).parents('.custom-accordion-wrap').find('.custom-accordion').length<=1){
        return;
      }
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

  getBookingDetails(bookingId='', forcePush=false) {

    if(this.state.processing) return;
    this.state.processing = true;
    this.resService.getReservSkeleton(bookingId || this.state.bookingID)
      .subscribe(
        res=>{
          this.state.processing=false
          //this.getTravelerList();
          if(res['success']) {
            this.bookingStructure = res['data'];

            /*if(!forcePush && this.profiles.length > 0 && this.profiles[this.profiles.length-1].guestName == '<New Profile>') {
              this.profiles[this.profiles.length-1] = res['data'];
            } else {*/
              let loadOptions = false;
              if(bookingId== '' && this.profiles.length == 0 && res['data'].guestName != '<New Profile>'){
                this.isCloneAll = false
                this.profiles.push(res['data']);
                console.log("???????????????????");
                loadOptions = true;
              }
              else if(bookingId != '' && this.isCloneAll) {
                console.log("???????????????????");
                this.profiles.push(res['data']);
                loadOptions = true;
              }

            //}
            if(loadOptions == true) {
              for (let groupIndex = 0; groupIndex < res['data']['inputGroups'].length; groupIndex++) {
                //inputFields loop through fields section
                for (let fieldIndex = 0; fieldIndex < res['data']['inputGroups'][groupIndex]['inputFields'].length; fieldIndex++) {
                  if (res['data']['inputGroups'][groupIndex]['inputFields'][fieldIndex].searchField) {
                    this.loadFieldOptions((this.profiles.length - 1), res['data']['inputGroups'][groupIndex]['inputFields'][fieldIndex], fieldIndex, groupIndex);
                  }
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

  loadFieldOptions(profileIndex, field, fieldIndex, groupIndex){
    this.profiles[profileIndex]['inputGroups'][groupIndex]['inputFields'][fieldIndex]['processing'] = true;
    this.canceler=this.lookupService.findResults(this.state.bookingID, [], {
        definitionType: 2,
        resourceTypeID: '00000000-0000-0000-0000-000000000000',
        searchCriteriaID: field.searchField.searchCriteriaID,
        filter: ''
      })
        .subscribe(
          res=>{
            this.profiles[profileIndex]['inputGroups'][groupIndex]['inputFields'][fieldIndex]['processing'] = false;
            //console.log(res['data'].results)
            if(res['success']) {
              this.profiles[profileIndex]['inputGroups'][groupIndex]['inputFields'][fieldIndex]['emptyValue'] = res['data']['emptyValue'] || ''
              this.profiles[profileIndex]['inputGroups'][groupIndex]['inputFields'][fieldIndex]['searchField']['list'] = res['data']['results']
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
    this.makeBookingClone('00000000-0000-0000-0000-000000000000', true, true);
    /*let temp = JSON.parse(JSON.stringify(this.bookingStructure));
    temp['guestName'] = title || '<New Profile>'
    this.profiles.push(
      temp
    );*/
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
        } else {
          let str = data['message'].split('.');
          this.toastr.error(str[0], 'Error!');
        }
        this.state.isLoadingTraveler = false;

      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
        let str = error['message'].split('.');
        this.toastr.error(str[0], 'Error!');
      });
  }

  selectTraveler ($event) {
    //console.log($event)

    if(!this.isCloneAll) {
      this.state.isLoadingTraveler = true;
      this.resService.setProfile(this.state.bookingID, {guestProfileID: $event.id})
        .subscribe(data => {
          this.state.isLoadingTraveler = false;
          if (data['status'] == 500) {
            let str = data['message'].split('.');
            this.toastr.error(str[0], 'Error!');
          }
          if (data['status'] == 200) {
            this.getBookingDetails();
            //this.addNewProfile((data['data']['firstName']+' '+data['data']['lastName']), data['data']);
          }

        }, error => {
          this.state.error = error;
          this.state.isLoadingTraveler = false;
        });
    } else {
      this.travelerList = [];
      this.makeBookingClone($event.id);
    }
  }

  makeBookingClone(profileId, isNewGuest=false, forcePush = false) {
    this.state.isLoadingTraveler = true;
    this.resService.cloneBooking(this.state.bookingID, {guestProfileID: profileId, isNewGuest: isNewGuest})
      .subscribe(data => {
        this.state.isLoadingTraveler = false;
        if (data['status'] == 500) {
          let str = data['message'].split('.');
          this.toastr.error(str[0], 'Error!');
        }
        if (data['status'] == 200) {
          this.getBookingDetails(data['data'],forcePush)
        }

      }, error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
        let str = error['message'].split('.');
        this.toastr.error(str[0], 'Error!');
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
        } else if(data['status'] == 500 ) {
          let str = data['message'].split('.');
          this.toastr.error(str[0], 'Error!');
        }


      },error => {
        this.state.error = error;
        this.state.isLoadingTraveler = false;
        let str = error['message'].split('.');
        this.toastr.error(str[0], 'Error!');
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
      let child=0;
      $(document).find(".accordion").each(function(){
        if(index == child ){
          if(!$(this).find('.collapse').hasClass('show')) {
            $(this).find('h2 > span').trigger('click');
          }
        }
        child++;
      })
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
    this.resService.bookProfile(profile.bookingID, body)
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
          let str = error['message'].split('.');
          this.toastr.error(str[0], 'Error!');
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
    profile['notValidated'] = !isValidated;
    return isValidated;
  }

  setValidation (field, profileIndex){
    field.errorMessage = "";
    if(field.isRequired && field.value == ""){
      field['errorMessage'] = field.name+" is Required"
    }
    let isValidated = true;
    this.profiles[profileIndex].inputGroups.filter(group => {
      group.inputFields.filter(field=>{
        if(field.isRequired && field.value == ""){
          isValidated = false;
        }
      })
    });
    this.profiles[profileIndex]['notValidated'] = !isValidated;
    //
    //logic to check overall validation
  }

  setGuestName (field, profileIndex, groupIndex){
      if(field.name == 'First Name' || field.name == 'Last Name') {
        let index =0;

        this.profiles[profileIndex].inputGroups[groupIndex].inputFields.filter(field=> {
          if(field.name == 'First Name'){
            this.profiles[profileIndex].guestName = field.value;
          }
          if( field.name == 'Last Name'){
            this.profiles[profileIndex].guestName = this.profiles[profileIndex].guestName +" "+field.value;
          }
        });
        if(!this.profiles[profileIndex].GuestName){
          this.profiles[profileIndex].GuestName = '<New Profile>'
        }
      }
  }
}
