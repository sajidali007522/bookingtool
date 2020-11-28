import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import * as $ from 'jquery'
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import {AlertModalComponent} from "../../../shared/alert-modal/alert-modal.component";
import {DeviceDetectionService} from "../../../_services/device-detection.service";
import {RoomsComponent} from "../rooms/rooms.component";

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit, AfterViewInit {
  @ViewChild(AlertModalComponent) childcomp: AlertModalComponent;

  bsConfig: Partial<BsDatepickerConfig>;
  remoteData =<any> [];
  remoteDataTemp = <any> [];
  state={
    massEdit: {
      processing:0,
      formState: false,
      lastIndex: -1,
      items: [],
      indexes:[],
      form: {}
    },
    mobileContainer: <any>[],
    recordVisible: 0,
    errorMessages: [],
    resourceTypeValue: 0,
    isMassEditting: false,
    recordLoaded: false,
    isEditting: false,
    minDate: new Date(),
    loading: {
      save: false,
      records: false,
      sites:false,
      ruleBag: false,
      resources: false,
      contract: false,
      contractor: false,
      ContractSite: false,
      ContractorList: false
    },
    resourceTypes: [],//lookup=ResourceType
    contracts: [], //
    sites: [],
    businessProfiles: [],
    ContractSites: [],
    ContractorList: [],
    roomTypeList: <any>[],
    filterForm: {
      beginDate:<any> new Date(),
      endDate:<any> new Date(),
      siteID: '00000000-0000-0000-0000-000000000000',
      businessProfileID: '00000000-0000-0000-0000-000000000000',
      resourceTypeID: '00000000-0000-0000-0000-000000000000',
      contractID: '00000000-0000-0000-0000-000000000000',
      ContractSite: '00000000-0000-0000-0000-000000000000',
      contractorID: '00000000-0000-0000-0000-000000000000',
      includeHolds: false
    },
    massEditForm: {number: 0, roomType: '00000000-0000-0000-0000-000000000000' }
  }
  constructor( private renderer: Renderer2,
               private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser,
               public dvcService:DeviceDetectionService
  ) {
    this.bsConfig = Object.assign({}, { dateInputFormat: 'MM/DD/YYYY' });
    let date = new Date();
    this.state.filterForm.beginDate = new Date(date.setDate(date.getDate()))
    this.state.filterForm.endDate = new Date(date.setDate(date.getDate()+30))
  }

  ngOnInit(): void {
    this.loadSites();
    this.loadResources();
    this.loadBusinessProfiles();
  }

  ngAfterViewInit() {
    $("body").on('click', ".accordion-group .accordon-heading", function(){
      $(this).parents('.accordion-group').toggleClass('group-active')
    })
  }
  setToDate() {
    let date = new Date(Date.parse(this.state.filterForm.beginDate));
    this.state.filterForm.endDate = new Date(date.setDate(date.getDate()+30))
  }

  loadSites() {
    this.state.loading.sites = true;
    this.lookupService.loadSites()
      .subscribe((res)=>{
        this.state.sites = res['data']['results'];
        this.state.filterForm.siteID = res['data']['results'][0].value;
        this.state.loading.sites=false;
      });
  }

  loadResources () {
    this.state.loading.resources = true;
    this.lookupService.loadResources()
      .subscribe((res)=>{
        this.state.loading.resources = false;
        this.state.resourceTypes = res['data']['results'];
        this.state.filterForm.resourceTypeID = res['data']['results'][0].value;
        this.setResourceType();
        this.state.filterForm.businessProfileID = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.contractorID = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.ContractSite = '00000000-0000-0000-0000-000000000000'
      })
  }

  setResourceType () {
    this.availService.getAvailabilityType(this.state.filterForm.resourceTypeID)
      .subscribe((res:any)=>{
        this.state.resourceTypeValue = res
      })
  }

  loadBusinessProfiles() {
    this.state.loading.ruleBag=true;
    this.lookupService.loadBusinessProfile()
      .subscribe(res=> {
        this.state.loading.ruleBag=false;
        this.state.businessProfiles=res['data']['results'];
        this.state.filterForm.contractID = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.ContractSite = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.contractorID = '00000000-0000-0000-0000-000000000000';
      })
  }

  resetFilter() {
    this.remoteData = [];
    this.remoteDataTemp = [];
    this.state.filterForm.businessProfileID = '00000000-0000-0000-0000-000000000000';
    this.state.filterForm.contractID = '00000000-0000-0000-0000-000000000000';
    this.state.filterForm.contractorID = '00000000-0000-0000-0000-000000000000';
    this.state.filterForm.ContractSite = '00000000-0000-0000-0000-000000000000'
  }

  loadContracts() {
    this.state.loading.contract = true;
    this.lookupService.loadContracts({criteria: this.state.filterForm.businessProfileID})
      .subscribe((res)=>{
        this.state.loading.contract = false;
        this.state.contracts = res['data']['results'];
      })
  }

  loadContractSites() {
    this.state.loading.ContractSite = true;
    this.lookupService.loadContractSites({criteria: this.state.filterForm.contractID})
      .subscribe((res)=>{
        this.state.loading.ContractSite = false;
        this.state.ContractSites = res['data']['results'];
      })
  }

  loadContractorList () {
    this.state.loading.ContractorList = true;
    this.lookupService.loadContractorList({criteria: this.state.filterForm.businessProfileID})
      .subscribe((res)=>{
        this.state.loading.ContractorList = false;
        this.state.ContractorList = res['data']['results'];
      })
  }

  loadRecords (avtiveIndex= 0) {
    if(this.state.loading.records == true) return;
    this.availService.resetErrors();
    if(!this.availService.validateFilters(this.state.filterForm, this.state.resourceTypeValue)){
      this.state.errorMessages = this.availService.getErrorMessages();
      this.childcomp.openAlertModal()
      return;
    }

    let beginDate = this.dateParser.formatDate(this.state.filterForm.beginDate);
    let endDate = this.dateParser.formatDate(this.state.filterForm.endDate);
    this.state.loading.records = true;
    this.availService.loadRecords(this.state.filterForm.siteID,
      this.state.filterForm.contractID,
      this.state.filterForm.resourceTypeID,
      this.state.filterForm.contractorID,
      {
        beginDate: beginDate,
        endDate: endDate,
        includeHolds: this.state.filterForm.includeHolds
      })
      .subscribe(res=> {
        this.state.recordLoaded=true;
        this.remoteData = res;
        this.state.recordVisible = avtiveIndex;
        if(this.dvcService.isMobile()) {
          if(this.state.resourceTypeValue == 1) {
            this.state.mobileContainer = JSON.parse(JSON.stringify(res['data']));
            this.remoteData['data'] = [res['data'][this.state.recordVisible]]
          } else {
            this.remoteData = [res[this.state.recordVisible]];
            this.state.mobileContainer = res;
          }
        }

      },
      err=>{
        console.log(err)
      },
      ()=>{
        this.state.loading.records = false;
        if(this.dvcService.isMobile()) {
          this.renderer.addClass(document.body, 'menu-fullwidth')
        }
      }
        );
  }

  setEditMode(event:any={}){
    console.log("setting edit mode");
    if((this.state.resourceTypeValue == 2 && this.remoteData.length <= 0) || (this.state.resourceTypeValue == 1 && this.remoteData['data'].length <= 0) ) return;
    this.remoteDataTemp = JSON.parse(JSON.stringify(this.remoteData));
    this.state.isEditting= true;
    this.state.filterForm.includeHolds = true
    this.loadRecords(this.state.recordVisible)
  }

  resetEditMode (event:any={}) {
    this.remoteData = JSON.parse(JSON.stringify(this.remoteDataTemp));
    this.state.isEditting= false;
    this.state.isMassEditting= false;
    this.state.filterForm.includeHolds = false;
    this.loadRecords();
  }

  setMassEdit(){
    if(this.remoteData.length <= 0 ) return;
    this.remoteDataTemp = JSON.parse(JSON.stringify(this.remoteData));
    this.state.filterForm.includeHolds = true;
    //this.state.resourceTypeValue
    if(this.state.filterForm.includeHolds && this.state.resourceTypeValue == 1) {
      //loadRoomTypes
      this.loadRoomFeatures(this.state.resourceTypeValue);
    }
    this.loadRecords();
    this.state.isMassEditting= true;
  }

  loadRoomFeatures (resourceType) {
    this.availService.loadRoomFeatures(this.state.filterForm.ContractSite, resourceType)
      .subscribe(
        res=> {
          this.state.roomTypeList = res;
        },
        err => { console.log(err)}
      )
  }

  selectNone(){
    if(this.state.resourceTypeValue == 1) {// rooms
      this.setRemoteDataState(this.remoteData['data'], false)
    }
    if(this.state.resourceTypeValue == 2) {// travel
      this.setRemoteDataState(this.remoteData, false)
    }
  }
  selectAll(){
    if(this.state.resourceTypeValue == 1) {// rooms
      this.setRemoteDataState(this.remoteData['data'], true)
    }
    if(this.state.resourceTypeValue == 2) {// travel
      this.setRemoteDataState(this.remoteData, true)
    }
  }

  setRemoteDataState(data, state) {
    data.filter(row=>{
      row.checked = state
    })
  }


  closeAlertModal(){
    this.childcomp.closeModal();
  }

  saveChanges(){
    if(this.state.loading.save == true) return;
    if(this.state.isMassEditting && (this.state.resourceTypeValue == 1 && this.state.massEditForm.roomType == '00000000-0000-0000-0000-000000000000')) {
      return;
    }
    let postBody;
    if(this.state.resourceTypeValue == 1) {
      postBody = [];
      for (let index=0; index<this.remoteData.data.length; index++) {
        let temp = {}
        let row = this.remoteData.data[index];
        if(row.checked) {
          temp = {
            "AvailabilityDate": row.date,
          }
          temp['Features'] = row.features.filter((feature) => {
            //console.log(feature, this.state.isMassEditting, this.state.massEditForm.roomType, feature.id);
            delete feature['$type']
            if(this.state.isMassEditting && this.state.massEditForm.roomType == feature.id) {
              //console.log(this.state.massEditForm.roomType, feature.id, this.state.massEditForm.roomType == feature.id);
              feature.hold = Number(this.state.massEditForm.number)
              return {
                "hold": Number(this.state.massEditForm.number),
                "id": feature.id,
                "number": feature.number,
                "checked": feature.checked
              };

            }
            else if(feature.checked && !this.state.isMassEditting) {
              console.log("here")
              return {
                "hold": Number(feature.hold),
                "id": feature.id,
                "number": feature.number,
                "checked": feature.checked
              };
            }
          })
          postBody.push(temp);
        }
      }
    }
    else {
      postBody = this.remoteData.filter((row)=> {
        if(row.checked) {
          delete row.$type
          row.total = Number(row.total)
          if(this.state.isMassEditting) { row.total = this.state.massEditForm.number }
          return row
        }
      });
    }
    console.log(postBody)

    this.state.loading.save = true;
    this.availService.patchAvailabilityRecord(postBody, this.state.filterForm.siteID,
      this.state.filterForm.contractID,
      this.state.filterForm.contractorID,
      this.state.filterForm.resourceTypeID)
      .subscribe(res=>{
        console.log(res)
          this.state.loading.save = false;
      },
        err=> {
        console.log(err)
          this.state.loading.save = false;
        })
  }

  saveCard(event:any={}) {
    console.log("card saved")
    this.saveChanges()
  }

  public nextPage(event) {
    if(!this.dvcService.isMobile()) return;
    if(this.state.recordVisible >= (this.state.mobileContainer.length-1)) { return; }
    this.state.recordVisible++
    if(this.state.resourceTypeValue == 1) {
      this.remoteData['data'] = [this.state.mobileContainer[this.state.recordVisible]];
    } else {
      this.remoteData = [this.state.mobileContainer[this.state.recordVisible]];
    }
  }
  public previousPage(event) {
    if(!this.dvcService.isMobile()) return;
    if(this.state.recordVisible <= 0) {return;}
    this.state.recordVisible--
    if(this.state.resourceTypeValue == 1) {
      this.remoteData['data'] = [this.state.mobileContainer[this.state.recordVisible]];
    } else {
      this.remoteData = [this.state.mobileContainer[this.state.recordVisible]];
    }
  }
  setMultipleSelect(index, room, $event, column){
    if(column.canEdit && column.dataProperty != 'FdStatus') return;
    console.log("selecting ", index, this.state.massEdit.lastIndex)
    this.state.massEdit.lastIndex=index;

  }

  completeMultipleSelect(index, room, $event, column){
    //console.log("completing", index, this.state.massEdit.lastIndex);
    if(column.canEdit && column.dataProperty != 'FdStatus') return;
    if(this.state.massEdit.lastIndex == -1) return;
    //if($event.shiftKey && $event.altKey) return;
    let flag = $event.shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : this.state.massEdit.lastIndex;
    while(flag <= index){
      this.handleMassEditRooms(flag, this.remoteData[flag])
      flag++;
    }
    this.state.massEdit.lastIndex = -1;
    return;
  }

  handleMassEditRooms (index, room) {
    if(this.state.massEdit.indexes.indexOf(index) != -1) {
      this.state.massEdit.indexes.splice(this.state.massEdit.indexes.indexOf(index), 1)
      this.state.massEdit.items.splice(this.state.massEdit.indexes.indexOf(index), 1)
      this.remoteData[index]['checked'] = false
      return;
    }
    this.state.massEdit.indexes.push(index)
    this.state.massEdit.items.push(room)
    //console.log(index,this.data[index])
    this.remoteData[index]['checked'] = true
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.getSelection()) {document.getSelection().empty();}
  }

}
