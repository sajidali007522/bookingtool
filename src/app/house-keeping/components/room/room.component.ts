import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../http.service";
import {RoomsService} from "../../../_services/rooms.service";
import {HouseKeepingService} from "../../../_services/house-keeping.service";
import { LoaderComponent } from "../../../shared-module/components/loader/loader.component";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit,AfterViewInit {
  keyword='text';
  error;

  state= {
    isLoading: false,
    filters: {sites: []},
    roomList: <any>[],
    searchRooms: false,
    isLoadingRoom: false,
    isLoadingImages: false,
    siteId: '',
    roomId: '',
    selectedRoom: {roomId: ''},
    room: null
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private _http: HttpService,
    private renderer: Renderer2,
    private HKService: HouseKeepingService
  ) {}

  ngOnInit(): void {
    this.state.isLoading = true;
    this.HKService.loadInitialConfig().subscribe(data => {
        this.state.filters.sites = data['sites'];
        this.state.siteId = data['sites'][0].value;
        this.state.isLoading=false;
      },
      err => {
        //handle errors here
        console.log(err);
        this.state.isLoading = false;
      });
  }

  ngAfterViewInit() {}

  loadRoomDetails(roomID){
    this.state.isLoadingRoom = true;
    this._http._get('housekeeping/'+this.state.siteId+'/Rooms/'+roomID)
      .subscribe((data) => {
        this.state.room = data;
        this.state.isLoadingRoom = false;
      })
  }


  //search section
  selectRoom (item) {
    console.log(item);
    this.loadRoomDetails(item.value);

  }

  searchCleared() {
    this.state.roomList = [];
  }

  getServerResponse(event) {
    this.error = '';
    this.state.searchRooms = true;

    let params = {searchTerm: event};

    this._http._get("housekeeping/RoomSearch", params)
      .subscribe(data => {
        if (data == undefined) {
          this.state.roomList = [];
          this.error = data['Error'];
        } else {
          this.state.roomList = data;
        }
        this.state.searchRooms = false;
      },error => {
        this.error = error;
        this.state.searchRooms = false;
      });
  }

}
