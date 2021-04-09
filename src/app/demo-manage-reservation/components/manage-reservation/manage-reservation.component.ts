import {
  Component,
  OnInit,
  Renderer2, OnDestroy
} from '@angular/core';
import {ReservationSearchService} from "../../../_services/reservation-search.service";


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
  constructor(private renderer: Renderer2, private resSearch: ReservationSearchService) {
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
      return;
    }

    if(this.state.loading.results) return;
    this.state.loading.results = true;
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
    let params={};
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
    this.state.showGrid = true;
  }




}

