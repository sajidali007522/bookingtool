import {
  Component,
  OnInit,
  Renderer2, OnDestroy
} from '@angular/core';


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
    doingAdvanceSearch: false,
    showGrid: false,
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

  ngOnDestroy() {
  }

  ngOnInit(): void {
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

