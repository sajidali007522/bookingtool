import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  Renderer2,
  AfterViewChecked, OnDestroy, ViewChild
} from '@angular/core';
import {Shift} from "./../../../interfaces/Shift";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {HouseKeepingService} from "./../../../_services/house-keeping.service";
import {RoomsService} from "../../../_services/rooms.service";
import {HttpService} from "../../../http.service";
import {Router} from "@angular/router";
import {RoomImageComponent} from "../room-image/room-image.component";
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";
import {AuthenticationService} from "../../../_services/authentication.service";
import {ConfigService} from "../../../config.service";
import {MyHammerConfig} from "./../../demo-housekeeping.module"
import { IMultiSelectOption } from 'ngx-bootstrap-multiselect';

import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";
import { fromEvent } from "rxjs";
import {takeWhile} from "rxjs/operators"
import * as $ from 'jquery';
import {DemoHousekeepingService} from "../../../_services/demo-housekeeping.service";
import {ModalComponent} from "../../../shared-module/components/modal/modal.component";

// const SHIFTS: Shift [] = [
//   {value: 1, text: "Day", id: 1, name: "Day"},
//   {value: 2, text: "TimeOut", id: 2, name: "Timeout"},
//   {value: 3, text: "Night", id: 3, name: "Night"},
// ];

@Component({
  selector: 'app-housekeeping',
  templateUrl: './housekeeping.component.html',
  styleUrls: ['./housekeeping.component.css']
})
export class HousekeepingComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  //@ViewChild(RoomImageComponent) room-image:RoomImageComponent;
  @ViewChild(ModalComponent) modalComp: ModalComponent;
  data;
  metaDataGroups = []
  pageFilters= {
    isHousekeeperAdmin: true,
    sites:'',
    features: '00000000-0000-0000-0000-000000000000',
    housekeepingStatuses: '',
    adminStatuses: '',
    housekeepers: '',
    searchText: '',
    searchField: '',
    shifts: []

  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  state = {
    message: '',
    loadMetaData: true,
    showRoomImages:  false,
    selectedRoom: {roomId: '', roomNumber: ''},
    roomImage: {
      name: '',
      description: ''
    },
    isLoading: false,
    isLoadingConfig: false,
    isLoadingRooms:  false,
    isLoadingMoreRooms: false,
    toggleFilter: false,
    pagination: {
      pageNum: 1,
      pageSize: 25,
      sortBy: '',
      sortOrder: false
    },
    filterConfigs: {
      sites: [],
      houseKeepers: [],
      features: [],
      shifts: [],
      hsStatus: [],
      adminStatuses: [],
      hkStatusFilter: '',
      shiftFilter: '',
      fdstatusFilter: ''

    }
  }
  dropdownSettings = {
    dataIdProperty: "value",
    dataNameProperty: "text",
    headerText: "Test header",
    noneSelectedBtnText: "All selected",
    btnWidth: "200px",
    dropdownHeight: "200px",
    showDeselectAllBtn: true,
    showSelectAllBtn: true,
    deselectAllBtnText: 'Deselect',
    selectAllBtnText: 'Select',
    btnClasses: 'btn btn-primary btn-sm dropdown-toggle',
    selectionLimit: 3,
    enableFilter: true
  };
  constructor (private HKService: HouseKeepingService,
               private DHKService: DemoHousekeepingService,
               private roomService: RoomsService,
               private ref: ChangeDetectorRef,
               private renderer: Renderer2,
               private _http: HttpService,
               private router: Router,
               private appConfigService: ConfigService
  ) {}

  ngOnDestroy() {
    this.data = [];
    this.pageFilters={
      isHousekeeperAdmin: true,
      sites:'',
      features: '00000000-0000-0000-0000-000000000000',
      housekeepingStatuses: '',
      adminStatuses: '',
      housekeepers: '',
      searchText: '',
      searchField: '',
      shifts: []
    }
  }

  ngOnInit(): void {
    this.state.isLoadingConfig = true;
    this.HKService.loadInitialConfig().subscribe(data => {

        this.pageFilters.isHousekeeperAdmin = data['isHousekeeperAdmin'];
        this.state.filterConfigs.shifts = [];
        this.state.filterConfigs.sites = data['sites'];
        this.pageFilters.sites = data['sites'][0].value;
        this.state.filterConfigs.houseKeepers = data['housekeepers'];
        this.state.filterConfigs.features = [];
        data['features'].filter( (f) => {
          this.state.filterConfigs.features.push({...f, ...{id: f.value, name: f.text}});
        });
        this.state.filterConfigs.hsStatus = data['housekeepingStatuses'];
        this.state.filterConfigs.adminStatuses = data['adminStatuses'];
        this.pageFilters.sites = data['sites'][0]['value'];
        this.state.isLoadingConfig=false;
        this.state.loadMetaData = true;
        this.ref.detectChanges();
        this.loadRooms();

      },
      err => {
        //handle errors here
        console.log(err);
        this.state.isLoadingConfig = false;
      });

    /*const hammerConfig = new HammerGestureConfig()
    //or if you use another class as provider:
    //    const hammerConfig=new MyHammerConfig()

    const hammer=hammerConfig.buildHammer(document.documentElement)
    fromEvent(hammer, "swipe")
      .subscribe((res: any) => {
        console.log(res.deltaX);
        res.deltaX<0 ? this.nextPage(): this.previousPage();
      });
    */
  }

  public refreshFilter () {
    this.pageFilters = {
      isHousekeeperAdmin: true,
      sites: this.state.filterConfigs.sites[0].value,
      features: this.state.filterConfigs.sites[0].value,
      housekeepingStatuses: '',
      adminStatuses: '',
      housekeepers: '',
      searchText: '',
      searchField: '',
      shifts: []
    }
    this.loadRooms();
  }

  public reloadConfigs () {
    this.state.isLoading=true;
    this.ref.detectChanges();
    this.HKService.loadSiteconfig(this.pageFilters.sites, {featureId : this.pageFilters.features}).subscribe(data => {
        this.state.filterConfigs.shifts = [];
        this.state.filterConfigs.houseKeepers = data['housekeepers'];
        this.state.filterConfigs.features = data['features'];
        this.state.filterConfigs.hsStatus = data['housekeepingStatuses'];
        this.state.filterConfigs.adminStatuses = data['adminStatuses'];
        this.pageFilters.features =  this.pageFilters.sites;
        this.state.isLoading = false;
        this.state.loadMetaData = true;
        this.ref.detectChanges();
        this.loadRooms();
      },
      err => {
        //handle errors here
        console.log(err);
        this.state.isLoading = false;
      });
  }

  public loadRooms (append = false) {
    if(this.state.isLoadingMoreRooms || this.state.isLoadingRooms) return;
    if(!this.state.isLoadingMoreRooms) {
      this.state.isLoadingRooms = true;
    }

    this.ref.detectChanges();
    this.DHKService.loadRooms(this.pageFilters.sites, {metadataGroups:[]},{
      includeMetadata: this.state.loadMetaData,
      //featureId : this.pageFilters.features,
      pageNum: this.state.pagination.pageNum,
      pageSize: (this.isMobileDevice() ? 1 :this.state.pagination.pageSize),
      searchField:this.pageFilters.searchField,
      searchText:this.pageFilters.searchText,
      sortBy: this.state.pagination.sortBy,
      sortOrder: this.state.pagination.sortOrder ? 'DESC' : 'ASC',
      adminMode: true
    }).subscribe(data => {
        console.log("processed")
        if(!append) {
          this.data = data['data']['roomStatuses'];
        } else {
          this.data = this.data.concat(data['data']['roomStatuses']);
        }
        if(this.state.loadMetaData) {
          this.metaDataGroups = data['data']['metadata']['metadataGroups'];
          //this.state.filterConfigs.shifts
          this.metaDataGroups.filter(group => {
            if(group.name == 'Shift') {
              this.state.filterConfigs.shifts = group.items;
            }
          })

        }
        this.state.isLoadingRooms = false;
        this.state.isLoadingMoreRooms = false;
        this.state.loadMetaData = false;
        this.setFilterStates();
        this.ref.detectChanges();
      },
      err => {
        //handle errors here
        console.log(err);
        this.state.isLoadingRooms = false;
        this.state.isLoadingMoreRooms = false;
      });
  }

  public setFilterStates() {
    this.metaDataGroups.filter((group) => {
      group.selectAll = false;
      let selectedItem = group.items.filter(item => {
        if(item.isSelected) return item;
      });
      if(group.items.length == selectedItem.length) {
        group.selectAll = true;
      }
    });
  }

  public handleFilterState(group) {
    group.selectAll = false;
    let selectedItem = group.items.filter(item => {
      if(item.isSelected) return item;
    });
    if(group.items.length == selectedItem.length) {
      group.selectAll = true;
    }
  }

  public updateHouseKeeping(roomId, roomRow, key, editKey) {
    //console.log(roomId, roomRow, key, editKey);
    roomRow[editKey] = false;
  }

  public enableEditMode (row, key, ele) {
    console.log(ele);
    row[key] = true;
    $("#"+ele).trigger('mousedown');
  }

  public initValue (obj, key, value) {
    obj[key] = value
  }

  public toggleProperty (obj, key) {
    obj[key] = !obj[key];
    console.log("clicked....",obj);
  }

  public setSortingParams (sortBy) {
    this.state.pagination.pageNum = 1;
    //false == asc, true=desc
    if(sortBy == this.state.pagination.sortBy) {
      this.state.pagination.sortOrder = !this.state.pagination.sortOrder;
    } else {
      this.state.pagination.sortOrder = false;
    }
    this.state.pagination.sortBy = sortBy;
    this.loadRooms();
    //this.state.pagination.sortOrder = this.state.pagination.sortOrder ? 'asc' : 'desc';
  }

  public loadNewPage () {
    this.state.pagination.pageNum++;
    console.log("called load new page");
  }

  public ngAfterViewInit () {
    $("body").scroll(() => {
      console.log($(window).scrollTop() + $(window).height(), '>=', $(document).height(), $(window).scrollTop() + $(window).height() >= $(document).height())
      if($(window).scrollTop() + $(window).height() >= $(document).height()) {
        console.log("bottom")
        if(this.state.isLoading || this.state.isLoadingRooms || this.state.isLoadingMoreRooms) return;
        //console.log("bottom");
        this.state.pagination.pageNum++;
        this.state.isLoadingMoreRooms = true;
        if(!this.isMobileDevice()) {
          this.loadRooms(true);
        }
      }
    })
    /*$("#container").scroll((e, arg) => {
      var elem = $(e.currentTarget);
      if (elem[0].scrollHeight - elem.scrollTop() <= elem.outerHeight()) {
        if(this.state.isLoading || this.state.isLoadingRooms || this.state.isLoadingMoreRooms) return;
        //console.log("bottom");
        this.state.pagination.pageNum++;
        this.state.isLoadingMoreRooms = true;
        if(!this.isMobileDevice()) {
          this.loadRooms(true);
        }
      }
    });*/
    $(".accordion-group .accordon-heading").on('click', function(){
      $(this).parents('.accordion-group').toggleClass('group-active')
    });
  }

  public ngAfterViewChecked() {
    //this.addJsToElement('assets/js/plugins/jsmartable.js');
    //$(".jsmartable").jsmartable();
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  fileChangeEvent(event: any, room:any): void {
    console.log(room);
    this.state.selectedRoom = room;
    this.imageChangedEvent = event;
    this.state.roomImage.name = "Picture of "+room.roomNumber;
    $(".trigger-image-crop-model").trigger('click');
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log("image cropped");
  }
  imageLoaded() {
    console.log("image has loaded")
  }
  cropperReady() {
    // cropper ready
    console.log("CRopper ready")
  }
  loadImageFailed() {
    // show message
    console.log("image loading failed")
  }

  doneWithCrop () {
    let image = this.croppedImage.split(",");
    this.state.selectedRoom['uploading']=true;
    this._http._post('housekeeping/'+this.pageFilters.sites+'/RoomImage/'+this.state.selectedRoom.roomId,
      {
        value:  image[1]
      },
      {
        imageName: this.state.roomImage.name,
        imageDescription: this.state.roomImage.description
      })
      .subscribe((data )=> {
          //this.router.navigate(['/house-keeping/'+this.pageFilters.sites+'/room/'+this.state.selectedRoom.roomId]);
          console.log(data);
          this.state.message = "Image has been attached"
          this.openModal()
          this.state.selectedRoom['uploading']=false;
        },
        (err) => {
          this.state.message = "Image has been attached"
          this.openModal()
          this.state.selectedRoom['uploading']=false;
          this.ref.detectChanges();
        });

  }
  closeRoomDetail(){
    this.state.showRoomImages = false;
    this.state.selectedRoom = {roomId: '', roomNumber: ''};
  }

  setRoom (room) {
    this.state.showRoomImages = true;
    this.state.selectedRoom=room;
  }
  cancelImageCrop () {
    this.imageChangedEvent = null;
    this.croppedImage = null;
  }

  public nextPage() {
    this.state.isLoadingMoreRooms = true;
    //if(this.state.pagination.pageNum > this.state.paginatin.totalRecords == this.state.pagination.pageNum)
    this.state.pagination.pageNum = Number(this.state.pagination.pageNum)+1;
    this.loadRooms()
  }
  public previousPage() {

    if(this.state.pagination.pageNum == 1){
      return;
    }
    //console.log(this.state.pagination.pageNum);
    this.state.isLoadingMoreRooms = true;
    this.state.pagination.pageNum= Number(this.state.pagination.pageNum)-1;
    //console.log(this.state.pagination.pageNum);
    this.loadRooms()
  }

  isMobileDevice(){
    return this.appConfigService['userDevice'] == 'mobile';
  }

  setPagination(){
    this.state.pagination.pageNum=1;
  }
  handleSearchBox (group) {
    group.showSearch = !group.showSearch;
  }

  handleFilterCheckboxState(group) {
    group.items.filter(item => {
      item.isSelected = group.selectAll
    })
  }
  openModal(){
    this.modalComp.openModal();
  }
  closeModal (){}
  scrolling(){ return true; }

}

