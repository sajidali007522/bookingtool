import {
  Component,
  OnInit,
  Renderer2, OnDestroy, AfterViewInit
} from '@angular/core';
import {ReservationSearchService} from "../../../_services/reservation-search.service";
import {DateFormatsService} from "../../../_services/date-formats.service";
import {DateParser} from "../../../_helpers/dateParser";
import {ToastrService} from "ngx-toastr";
import {ConfigService} from "../../../config.service";
import {HttpService} from "../../../http.service";
import * as $ from "jquery";


// const SHIFTS: Shift [] = [
//   {value: 1, text: "Day", id: 1, name: "Day"},
//   {value: 2, text: "TimeOut", id: 2, name: "Timeout"},
//   {value: 3, text: "Night", id: 3, name: "Night"},
// ];

@Component({
  selector: 'app-manage-reservation',
  templateUrl: './manage-reservation.component.html',
  styleUrls: ['./manage-reservation.component.css']
})
export class ManageReservationComponent implements OnInit, OnDestroy, AfterViewInit {
  //@ViewChild(RoomImageComponent) room-image:RoomImageComponent;

  state={
    selectedReservation: {},
    loading:{
      searchForm: false,
      column:false,
      results:false
    },
    messageNotFound: 'Processing...',
    searchForm: <any>[],
    doingAdvanceSearch: false,
    showGrid: false,
    showForm: false,
    grid:{
      columns: <any>[],
      processing: false,
      items: []
    }
  }
  constructor(public dateParse: DateParser,
              private renderer: Renderer2,
              private toastr: ToastrService,
              private appConfigService: ConfigService,
              private resSearch: ReservationSearchService,
              private _http: HttpService) {
    //searchForm
    this.state.loading.searchForm = true
    this.resSearch.loadCriteriaDefinition().subscribe(
      res =>{
        this.state.searchForm=res['data'];
        this.state.loading.searchForm = false
        console.log(res['data']['searchFields'].length)
        for (let index=0; index < res['data']['searchFields'].length; index++){
          //console.log(res['data']['searchFields'][index])
          if(res['data']['searchFields'][index].lookupSearch != '') {
            this._http._get('lookup/' + res['data']['searchFields'][index].lookupSearch)
              .subscribe(res => {
                this.state.searchForm['searchFields'][index]['model'] = '00000000-0000-0000-0000-000000000000'
                this.state.searchForm['searchFields'][index]['results'] = res['data']['results'];
              })
          }
        }
      },
      err =>{
        this.state.loading.searchForm = false
      }
    )
    //grid columns
    this.state.loading.column =true
    this.resSearch.loadResultDefinition().subscribe(
      res =>{
        this.state.loading.column = false
        this.state.grid.columns = res['data']

        //this.getResults();
      },
      err =>{
        this.state.loading.column = false
      }
    )
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
    if(this.isMobileDevice()) {
      this.closeFilterBar();
    }
  }
  ngAfterViewInit() {
    $(".reservation-sidebar-inner").on('click', ".accordion-group > .accordon-heading",function(){
      $(this).parents('.accordion-group').toggleClass('group-active')
    });
  }

  validateForm () {
    let emptyForm = this.state.searchForm.searchFields.filter(field=> {
      if (!field.model) {
        return field
      }
    });
    return !(this.state.searchForm.searchFields.length == emptyForm.length);
  }

  getResults(){
    if(!this.validateForm()) {
      this.toastr.error('Please select some search criteria.', 'Error!')
      return;
    }

    if(this.state.loading.results) return;
    this.state.loading.results = true;
    this.state.showGrid = true;
    this.state.showForm = false;
    this.state.messageNotFound = 'Processing...'
    this.resSearch.makeSearch(this.renderSearchForm()).subscribe(
      res=>{
        this.state.loading.results = false;
        if(res['status'] != 500) {
          this.state.grid.items = res['data']['results']
          if (res['data']['results'].length <= 0) {
            this.state.messageNotFound = 'No Record Found'
          }
        } else {
          this.toastr.error(res['message'], 'Error!');
          this.state.messageNotFound = res['message'];
        }
      },
      error => {
        this.state.loading.results = false;
        console.log(error)
      },
      () => {
        if(this.isMobileDevice()){
          this.closeFilterBar()
        }
      }
    )

  }

  renderSearchForm(){
    let params={
      pageIndex: 0,
      numberOfItemsPerPage: 25
    };
    this.state.searchForm.searchFields.filter(field=>{
      if(field.model) {
        params[field.property] = field.model;
      }
    });
    return params;
  }

  closeFilterBar(){
    this.renderer.addClass(document.body, 'menu-fullwidth')
  }

  openFilterBar () {
    //$(document).find('.header-wrap > .menu-icon ').trigger('click');
    //document.getElementById('widthSwitch').click();
    this.renderer.removeClass(document.body, 'menu-fullwidth')
  }

  toggleAdvanceSearch () {
    this.state.doingAdvanceSearch = !this.state.doingAdvanceSearch
    this.state.showGrid = false;
  }

  startSearch () {
    //this.state.showGrid = true;
  }

  selectReservation (item){
    this.state.showGrid = false;
    this.state.showForm = true;
    this.state.loading.results = true
    this.resSearch.selectReservation(item.ID, {populateEntireReservation: true})
      .subscribe(
        res => {
          this.state.loading.results = false
          this.state.selectedReservation = res['data']
        },
        err => {
          this.state.loading.results = false
        },
        ()=>{
        }
      )
  }

  backToList(){
    this.state.showForm = false;
    this.state.showGrid = true;
  }

  isMobileDevice(){
    return this.appConfigService['userDevice'] == 'mobile';
  }


}

