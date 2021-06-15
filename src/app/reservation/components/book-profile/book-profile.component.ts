import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import{ ChangeDetectorRef } from '@angular/core';
import {HttpService} from "../../../http.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as $ from 'jquery';
import {TemplateService} from "../../../_services/template.service";
import {ReservationService} from "../../../_services/reservation.service";
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";


@Component({
  selector: 'app-book-profile',
  templateUrl: './book-profile.component.html',
  styleUrls: ['./book-profile.component.scss']
})
export class BookProfileComponent implements OnInit,AfterViewInit, AfterViewChecked {

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
              private cdRef : ChangeDetectorRef,
              public router: Router
  ) {
  }

  selectTraveler ($event) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.state.bookingID = params["booking_id"];
      this.state.searchId = params['search_id'];
    });
    this.setProfile();
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

  setProfile(){
    //​/api2​/booking​/{bookingID}​/Reporting
    this.state.processing = true;
    this._http._get('booking/'+this.state.bookingID+'/Reporting', {})
      .subscribe(data => {
        this.state.processing=false;
        console.log(data)
        //this.formFields = data;
        this.loadFields(data);

      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }

  loadFields(fields) {
    ///api2/booking/{bookingID}/AllSearchCriteriaOptions
    let selectedItems = this.renderSelectedItems(fields)
    let searchDefinitions = this.renderSearchCriteriaItems(fields)

    this.state.processing = true;
    this._http._patch('booking/'+this.state.bookingID+'/ReportingOptions',
      {
        'selectedItems': selectedItems,
        'lookupSearchCriterias': searchDefinitions
      }
    )
      .subscribe(data => {
        this.state.processing=false;
        console.log(data)
        this.formFields = fields;
        this.definition = data;
      }, error => {
        console.log(error)
        this.state.processing=false;
      })
  }

  renderSelectedItems (fields) {
    let temp = []
    fields.filter(field=>{
      if(field.model) {
        temp.push({
          "relation": (field.fieldRelation|| '00000000-0000-0000-0000-000000000000'),
          "selection": (typeof field.model.value !== 'undefined' ? field.model.value : field.model),
          "type": (field.type || 0),
          "selectionText": (typeof field.model.text !== 'undefined' ? field.model.text : field.model)
        })
      }

    })
    return temp;
  }

  renderSearchCriteriaItems(fields){
    let temp = []
    fields.filter(field=>{
      if(!field.model) {
        field.model = ''
      }
      temp.push({
        "resourceTypeID": "00000000-0000-0000-0000-000000000000",
        "searchCriteriaID": field.searchCriteriaID,
        "filter": (field.model.text ? field.model.text : field.model)
      })
    })
    return temp;
  }

  submitForm() {
    if(!this.validateForm()){
      return;
    }
  }

  validateForm() {
    let validated = true;
    this.formFields.filter(field => {
      field['validationError'] = 'passed'
      if(!field.model && field.isRequired){
        field['validationError'] = field.name+ ' is required field';
        validated = false;
      }
    });
    return validated;
  }

  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }

  bindField(event) {
    event = JSON.parse(event);
    this.formFields[event.fieldIndex].visible = event.field.visible;
    this.loadFields(this.formFields);
  }
  openModal(){
    this.childcomp.openModal();
  }
  restartReservation($event){
    if($event){
      this.router.navigate(['/reservation']);
    }
  }
}
