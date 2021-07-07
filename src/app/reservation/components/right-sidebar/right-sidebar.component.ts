import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateParser} from "../../../_helpers/dateParser";
import {UserService} from "../../../_services/user.service";

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {

  @Input() cart=[];
  @Input() selectedIndece;
  @Input() bookedSegments=[]
  @Input() page;

  @Output() removeItem = new EventEmitter<string>();
  @Output() replaceItem = new EventEmitter<string>();

  state={
    isSideBarOpen: false,
  }
  constructor(
    public dateParse: DateParser,
    public userService:UserService) { }

  ngOnInit(): void {
  }

  toggleSideBar(){
    this.state.isSideBarOpen = !this.state.isSideBarOpen;
  }
  removeItemFromCart(segmentIndex, segment) {
    this.removeItem.emit(JSON.stringify({segment: segment, index:segmentIndex}))
  }
  reselectResource(segmentIndex, segment) {
    this.replaceItem.emit(JSON.stringify({segment: segment, index:segmentIndex}))
  }
}
