import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
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
  removeItemFromCart(UniqueId, index, priceId) {

    this.selectedIndece=this.cart[index].cartPreview.searchIndece;
    this.cart.splice(index, 1);

  }
}
