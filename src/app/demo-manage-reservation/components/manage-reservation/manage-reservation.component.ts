import {
  Component,
  OnInit,
  Renderer2, OnDestroy
} from '@angular/core';
import {ReservationSearchService} from "../../../_services/reservation-search.service";
import {DateFormatsService} from "../../../_services/date-formats.service";
import {DateParser} from "../../../_helpers/dateParser";
import {ToastrService} from "ngx-toastr";


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
export class ManageReservationComponent implements OnInit, OnDestroy {
  //@ViewChild(RoomImageComponent) room-image:RoomImageComponent;

  state={
    selectedReservation: {},
    loading:{
      searchForm: false,
      column:false,
      results:false
    },
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
              private resSearch: ReservationSearchService) {
    //searchForm
    this.state.loading.searchForm = true
    this.resSearch.loadCriteriaDefinition().subscribe(
      res =>{
        this.state.searchForm=res['data'];
        this.state.loading.searchForm = false
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
  }
  validateForm (){
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
    this.resSearch.makeSearch(this.renderSearchForm()).subscribe(
      res=>{
        this.state.loading.results = false;

        this.state.grid.items = res['data']['results']
      },
      error => {
        this.state.loading.results = false;
        console.log(error)
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




}

