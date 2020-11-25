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
import {DeviceDetectionService} from "../../../_services/device-detection.service";

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
  @ViewChild(ConfirmModalComponent) confirmModalComp: ConfirmModalComponent;
  data;
  metaDataGroups = [];
  gridColumns=[];
  pageFilters= {
    isHousekeeperAdmin: true,
    sites:'',
    features: '00000000-0000-0000-0000-000000000000',
    housekeepingStatuses: '',
    adminStatuses: '',
    housekeepers: '',
    searchValue: '',
    searchBy: '',
    shifts: []

  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canceler: any;
  state = {
    isTablet: false,
    descriptionLimit: 150,
    massEdit: {
      processing:false,
      formState: false,
      lastIndex: -1,
      items: [],
      indexes:[],
      form: {}
    },
    alertMessages : '',
    gridDropDowns: {},
    message: '',
    modalTitle: '',
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
      sortOrder: false,
      totalRooms: 0
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
               private appConfigService: ConfigService,
               public ddService: DeviceDetectionService
  ) {
    this.state.isTablet = ddService.isTablet();
  }

  ngOnDestroy() {
    this.data = [];
    this.pageFilters={
      isHousekeeperAdmin: true,
      sites:'',
      features: '00000000-0000-0000-0000-000000000000',
      housekeepingStatuses: '',
      adminStatuses: '',
      housekeepers: '',
      searchValue: '',
      searchBy: '',
      shifts: []
    }
  }

  ngOnInit(): void {
    if(this.isMobileDevice()) {
      this.closeFilterBar();
    }
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
        this.state.pagination.pageNum=1;
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
      searchBy: '',
      searchValue: '',
      shifts: []
    }
    this.state.alertMessages = '';
    this.state.pagination.pageNum=1;
    this.state.loadMetaData = true
    this.metaDataGroups=[];
    this.loadRooms();
  }

  public reloadConfigs () {
    if(this.pageFilters.sites == '00000000-0000-0000-0000-000000000000') return;
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
        this.state.pagination.pageNum=1;
        this.state.loadMetaData = true
        this.metaDataGroups=[];
        this.ref.detectChanges();
        this.loadRooms();
      },
      err => {
        //handle errors here
        console.log(err);
        this.state.isLoading = false;
      });
  }

  public getMetaDataGroup () {
    let body = [];
    this.metaDataGroups.filter((group) => {
      let itemTemp = [];
      group.items.filter(item => {
        if(item.isSelected) {
          itemTemp.push(item.key)
        }
      });

      body.push({'selectedMetadataItems': itemTemp, key: group.key});
    });
    return body;
  }

  public checkOnly (group, item) {
    if(group.$actual) {
      group.$actual.filter(i => {
        i.isSelected = false;
        if (i.key === item.key) {
          i.isSelected = true;
        }
      })
    }
    group.items.filter((item)=>{
      item.isSelected = false;
    })
    item.isSelected = true;
    group.selectAll = false;
    this.state.pagination.pageNum = 1;
    this.loadRooms();
  }
  public filterBySearchBox(){
    if(this.pageFilters.searchValue == '' || this.pageFilters.searchBy == '') return;
    this.state.pagination.pageNum = 1;
    this.state.loadMetaData = true;
    if(this.isMobileDevice()){
      this.closeFilterBar();
    }
    this.loadRooms();
  }
  public loadRooms (append = false) {
    if(!this.state.isLoadingMoreRooms) {
      if(this.canceler) { this.canceler.unsubscribe(); }
      this.state.isLoadingRooms = true;
    }

    this.ref.detectChanges();
    this.state.pagination.pageSize = this.isMobileDevice() ? 1 : 25;
    this.canceler = this.DHKService.loadRooms(this.pageFilters.sites, {metadataGroups:this.getMetaDataGroup()},{
      includeMetadata: this.state.loadMetaData,
      //featureId : this.pageFilters.features,
      pageNum: this.state.pagination.pageNum,
      pageSize: this.state.pagination.pageSize,
      searchBy:this.pageFilters.searchBy,
      searchValue:this.pageFilters.searchValue,
      sortBy: this.state.pagination.sortBy,
      sortOrder: this.state.pagination.sortOrder ? 'DESC' : 'ASC',
      adminMode: true
    }).subscribe(data => {
      if(data['success']) {
          console.log("processed")
          if (!append) {
            this.data = data['data']['roomStatuses'];
          } else {
            this.data = this.data.concat(data['data']['roomStatuses']);
          }
          if (this.state.loadMetaData && data['data']['metadata']['metadataGroups']) {
            this.metaDataGroups = data['data']['metadata']['metadataGroups'];
            this.gridColumns = data['data']['metadata']['columns'];
            //this.state.filterConfigs.shifts
            this.gridColumns.filter(column => {
              this.state.gridDropDowns[column.dataProperty] = this.setGridDropDowns(column);
            });
            //console.log(this.state.gridDropDowns);
          }
          this.state.pagination.totalRooms = data['data']['totalRooms'];
          this.setFilterStates();
        }
        else {
          this.state.alertMessages = data['message']
          $(document).find(".reservation-content-area").scrollTop(0);
      }

        this.state.isLoadingRooms = false;
        this.state.isLoadingMoreRooms = false;
        this.state.loadMetaData = false;
      },
      err => {
        //handle errors here
        //console.log(err);
        this.state.isLoadingRooms = false;
        this.state.isLoadingMoreRooms = false;
        this.state.loadMetaData = false;
        this.state.alertMessages = err['message']
        console.log(err);
      },
      ()=>{
        this.canceler.unsubscribe();
        if(this.isMobileDevice()){
          this.reReadGridTitles();
        }
      });
  }
  reReadGridTitles () {
    $(document).find(".table-housekeeping-wrap .table-bordered td").each(function(){
      $(this).attr('data-title', $(this).attr('title'))
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

  public handleFilterState(group, item) {
    group.selectAll = true;
    let selectedItem = group.items.filter(item => {
      if(item.isSelected) return item;
    });
    if(group.items.length != selectedItem.length) {
      group.selectAll = false;
    }
    this.state.pagination.pageNum = 1;
    this.loadRooms();
    //
    /*console.log(item.isSelected, "tr."+group.key+"_"+item.key.split('-').join('_'))
    if(!item.isSelected) {
      $("tr."+group.key+"_"+item.key.split('-').join('_')).hide()
    } else {
      $("tr."+group.key+"_"+item.key.split('-').join('_')).show()
    }*/
  }
  public checkAll (group) {
    group.items.filter(item => {
      item.isSelected = true
    });
    group.selectAll = true;
    this.loadRooms();
  }
  public updateHouseKeeping(roomId, roomRow, key, editKey) {
    roomRow['$processing'] = true;
    let params = {
      roomIDs: roomId,
      originalValueIDs: roomRow['$'+this.capitalizeFirstLetter(key)+'Id'],
      newValueIDs: roomRow[this.capitalizeFirstLetter(key)+'Id'],
      updateTypeIDs: this.DHKService.updateTypeIds[key],
    }
    delete roomRow.$type;
    this.DHKService.saveRoom('housekeeping/'+this.pageFilters.sites+'/Rooms/MassUpdate', {}, params)
      .subscribe(
        res => {
          roomRow['$processing'] = false;
          if(res['status'] == 500) {
            this.state.alertMessages = res['message']
          } else {
            roomRow = res['data'][0];
          }

        },
        err => { console.log(err)},
        ()=>{
          roomRow[editKey] = false;
          roomRow['$processing'] = false;
        }
      )
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
    if(this.state.massEdit.items.length > 0 ) {
      this.openConfirmModal()
    } else {
      this.loadRooms();
    }
    //this.state.pagination.sortOrder = this.state.pagination.sortOrder ? 'asc' : 'desc';
  }

  public loadNewPage () {
    this.state.pagination.pageNum++;
    console.log("called load new page");
  }

  public ngAfterViewInit () {

    $(".reservation-content-area").scroll((e, arg) => {
      var elem = $(e.currentTarget);
      if (elem[0].scrollHeight - elem.scrollTop() <= elem.outerHeight()) {
        if(this.state.isLoading || this.state.isLoadingRooms || this.state.isLoadingMoreRooms) return;
        //console.log("bottom");
        console.log(Math.ceil(this.state.pagination.totalRooms / this.state.pagination.pageSize), '<=', this.state.pagination.pageNum, Math.ceil(this.state.pagination.totalRooms / this.state.pagination.pageSize) <= this.state.pagination.pageNum)
        //if(Math.ceil(this.state.pagination.totalRooms / this.state.pagination.pageSize) <= this.state.pagination.pageNum) {
        if((this.state.pagination.pageNum*this.state.pagination.pageSize) >= this.state.pagination.totalRooms) {
          return;
        }
        if(!this.isMobileDevice()) {
          this.state.pagination.pageNum++;
          this.state.isLoadingMoreRooms = true;
          this.loadRooms(true);
        }
      }
    });
    $(".reservation-sidebar-inner").on('click', ".accordion-group > .accordon-heading",function(){
      $(this).parents('.accordion-group').toggleClass('group-active')
    });
  }
  public expandContainer (event, group) {
    group.expanded = !group.expanded
    $(event.target).parents('.accordion-body').find('ul.container').toggleClass('expand');
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
    this.state.selectedRoom = room;
    this.imageChangedEvent = event;
    this.state.roomImage.name = "Picture of "+room.roomNumber;
    this.state.roomImage.description = ''
    console.log(event);
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
    //this._http._post('housekeeping/'+this.pageFilters.sites+'/RoomImage/'+this.state.selectedRoom.roomId,
    this.DHKService.uploadRoomImage('housekeeping/'+this.pageFilters.sites+'/RoomImage/'+this.state.selectedRoom.roomId,
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
          this.state.modalTitle = "Success"
          this.openModal()
          this.state.selectedRoom['uploading']=false;
        },
        (err) => {
          this.state.message = "There is Some Error, Try Again!"
          this.state.modalTitle = "Error"
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
    if(!this.isMobileDevice()) return;
    console.log(Math.ceil(this.state.pagination.totalRooms / this.state.pagination.pageSize), '<=', this.state.pagination.pageNum, Math.ceil(this.state.pagination.totalRooms / this.state.pagination.pageSize) <= this.state.pagination.pageNum)
    if(this.state.pagination.pageNum>=this.state.pagination.totalRooms ) {
      return;
    }
    this.state.isLoadingMoreRooms = true;
    //if(this.state.pagination.pageNum > this.state.paginatin.totalRecords == this.state.pagination.pageNum)
    this.state.pagination.pageNum = Number(this.state.pagination.pageNum)+1;
    this.loadRooms()
  }
  public previousPage() {
    if(!this.isMobileDevice()) return;
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

  filterList(group, term) {
    if(typeof group.$actual == 'undefined') {
      group.$actual = JSON.parse(JSON.stringify(group.items));
    }
    group.items = JSON.parse(JSON.stringify(group.$actual));
    let temp = [];
    temp = group.items.filter((item) => {
      return item.name.toLowerCase().indexOf(term.toLowerCase()) !== -1
    });
    group.items = JSON.parse(JSON.stringify(temp));
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
  getGroupItems(column){
    return this.state.gridDropDowns[column.dataProperty];
  }

  setGridDropDowns(column){
    let selectedGroup = {items:[]};
    switch (column.dataProperty) {
      case "Features":
        break;
      case "FdStatus":
        this.metaDataGroups.filter(group => {
          if(group.name ==  "Front Desk Status") {
            selectedGroup = group;
          }
        });
        break;
      case "HkStatus":
        this.metaDataGroups.filter(group => {
          if(group.name ==  "Housekeeping Status") {
            selectedGroup = group;
          }
        });
        break;
      case "Housekeeper":
        selectedGroup = {items: []};
        this.state.filterConfigs.houseKeepers.filter(houseKeeper => {
          selectedGroup.items.push({key: houseKeeper.value, name: houseKeeper.text})
        });
        break;
      case "Shift":
        this.metaDataGroups.filter(group => {
          if(group.name == "Shift") {
            selectedGroup = group;
          }
        });
        break;
      case "AdminStatus":
        this.metaDataGroups.filter(group => {
          if(group.name == "Admin Status") {
            selectedGroup = group;
          }
        });
        break;
      case "LinenStatus":
        break;
    }

    return selectedGroup.items;
  }
  clearFilter(group) {
    group.search = '';
    this.filterList(group, '')
  }

  selectRoom(room, $event, index,column) {
    if(column.canEdit && column.dataProperty != 'FdStatus') {
      return;
    }
    if($event.shiftKey && $event.altKey && this.state.massEdit.lastIndex == -1) {
      this.setMultipleSelect(index, room, $event, column);
      return;
    }
    else if($event.shiftKey && $event.altKey && this.state.massEdit.lastIndex != -1) {
      this.completeMultipleSelect(index, room, $event, column);
      return;
    }
    else {
      this.handleMassEditRooms(index, room);
      this.state.massEdit.lastIndex = -1;
    }
  }

  setMultipleSelect(index, room, $event, column){
    if(this.isMobileDevice()) return;
    if(column.canEdit && column.dataProperty != 'FdStatus') return;
    //if(!$event.shiftKey) return;
    //if(!$event.shiftKey && $event.altKey) return;

    console.log("selecting ", index, this.state.massEdit.lastIndex)
    this.state.massEdit.lastIndex=index;

  }

  completeMultipleSelect(index, room, $event, column){
    if(this.isMobileDevice()) return;
    //console.log("completing", index, this.state.massEdit.lastIndex);
    if(column.canEdit && column.dataProperty != 'FdStatus') return;
    if(this.state.massEdit.lastIndex == -1) return;
    //if($event.shiftKey && $event.altKey) return;
    let flag = $event.shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : this.state.massEdit.lastIndex;
    while(flag <= index){
      this.handleMassEditRooms(flag, this.data[flag])
      flag++;
    }
    this.state.massEdit.lastIndex = -1;
    return;

  }

  handleMassEditRooms (index, room) {
    if(this.isMobileDevice()) return;
    console.log(this.state.massEdit.indexes.indexOf(index));
    let massEditIndex = this.state.massEdit.indexes.indexOf(index)
    if(massEditIndex != -1) {
      console.log(this.state.massEdit.indexes, massEditIndex);
      this.state.massEdit.indexes.splice(massEditIndex, 1)
      this.state.massEdit.items.splice(massEditIndex, 1)
      this.data[index]['isSelected'] = false
      return;
    }
    this.state.massEdit.indexes.push(index)
    this.state.massEdit.items.push(room)
    //console.log(index,this.data[index])
    this.data[index]['isSelected'] = true
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.getSelection()) {document.getSelection().empty();}
  }

  removeSelectedItem (room, index) {
    //console.log(index, this.state.massEdit.indexes)
    this.data[this.state.massEdit.indexes[index]]['isSelected'] = false
    this.state.massEdit.items.splice(index, 1)
    this.state.massEdit.indexes.splice(index, 1)
  }

  getEditAbleColumns(gridColumns){
    let cols = []
    gridColumns.filter(column => {
      if(column.canEdit && column.dataProperty != 'FdStatus') {
        cols.push(column)
      }
    });
    return cols;
  }
  toggleFormState(event){
    $(event.target).parent('h3').toggleClass('active');
    $(event.target).parent('h3').next('.custom-accordion-content').toggleClass('exp')
  }
  resetRoomStatus(){
    for (let i=0; i < this.state.massEdit.indexes.length; i++) {
      this.data[this.state.massEdit.indexes[i]]['isSelected'] = false;
    }
    this.state.massEdit.indexes = []
    this.state.massEdit.items = []
  }
  processMassEdit(column){
    if(this.state.massEdit.processing) return;
    this.state.massEdit.processing=true;
    let roomIds=[]
    let originalValueIds = []
    let parsedIndex = {};
    let count = 0;
    this.state.massEdit.indexes.filter(index => {
      let roomRow = this.data[index];
      roomIds.push(roomRow.roomId);
      originalValueIds.push(roomRow[this.capitalizeFirstLetter(column.dataProperty)+'Id'])
      parsedIndex[roomRow.roomId] = {grid: index, massEdit: count};
      count++;
    });
    let param = {
      roomIDs: roomIds.join(","),
      originalValueIDs: originalValueIds.join(","),
      newValueID: this.state.massEdit.form[column.dataProperty+'Id'],
      updateTypeID: this.DHKService.updateTypeIds[column.dataProperty],
    }

    this.DHKService.saveRoom('housekeeping/'+this.pageFilters.sites+'/Rooms/MassUpdate', {}, param)
      .subscribe(
        res => {
          this.state.message = 'Room Data has been updated!!'
          this.state.modalTitle = "Success!"
          res['data'].filter((row) => {
            let c = parsedIndex[row.roomId];
            this.data[c.grid] = row;
            this.data[c.grid]['isSelected'] = true;
            this.state.massEdit.items[c.massEdit] = row;
          });
        },
        err => { console.log(err)
          this.state.message = 'There is something wrong with input. Room data is not updated!!'
          this.state.modalTitle = "Error!"
        },
        ()=>{
          this.state.massEdit.processing=false;
        }
      )
  }

  clearMassEditField(column){
    this.state.massEdit.form[column.dataProperty+'Id'] = ''
  }
  scrolling(){ return true; }
  stripLength() {
    if(this.state.roomImage.description.length >150) {
      this.state.roomImage.description = this.state.roomImage.description.substring(0, 150);
    }
    this.state.descriptionLimit = 150 - this.state.roomImage.description.length;
  }
  openFilterBar () {
    //$(document).find('.header-wrap > .menu-icon ').trigger('click');
    //document.getElementById('widthSwitch').click();
    this.renderer.removeClass(document.body, 'menu-fullwidth')
  }

  closeFilterBar(){
    this.renderer.addClass(document.body, 'menu-fullwidth')
  }
  openConfirmModal(){
    this.confirmModalComp.openModal();
  }
  warningConfirmed (event) {
    if(event) {
      this.state.massEdit = {
        processing:false,
        formState: false,
        lastIndex: -1,
        items: [],
        indexes:[],
        form: {}
      }
      this.loadRooms();
    }
  }

}

