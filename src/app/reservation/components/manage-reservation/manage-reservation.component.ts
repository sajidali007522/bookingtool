import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';

import * as $ from 'jquery'
import {ModalComponent} from "../../../shared-module/components/modal/modal.component";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-manage-reservation',
  templateUrl: './manage-reservation.component.html',
  styleUrls: ['./manage-reservation.component.scss']
})
export class ManageReservationComponent implements OnInit, AfterViewInit,OnDestroy {

  state={
    doingAdvanceSearch: false,
    grid:{
      processing: false,
      items: [
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
        {'date': '2020-09-11', 'dayOfWeek': 1, 'total': 100, 'available': 50, 'pickup': 90, 'percentage': '20%'},
      ]
    }
  }
  constructor(private renderer: Renderer2 ) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(){
  }

  ngAfterViewInit() {
    $("body").on('click', ".accordion-group .accordon-heading", function(){
      $(this).parents('.accordion-group').toggleClass('group-active')
    })
  }

  startSearch (){

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
  }


}
