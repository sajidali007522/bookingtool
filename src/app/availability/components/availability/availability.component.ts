import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import * as $ from 'jquery'
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import {AlertModalComponent} from "../../../shared/alert-modal/alert-modal.component";
import {DeviceDetectionService} from "../../../_services/device-detection.service";
import {RoomsComponent} from "../rooms/rooms.component";
import {ModalComponent} from "../../../shared-module/components/modal/modal.component";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild(AlertModalComponent) childcomp: AlertModalComponent;
  @ViewChild(ModalComponent) modalComp: ModalComponent;

  bsConfig: Partial<BsDatepickerConfig>;
  remoteData =<any> [];
  remoteDataTemp = <any> [];
  state={
    resources:{
      lookup: <any> '',
      resourceType: <any> '',
      businessProfile: <any> '',
      contracts: <any> '',
      contractSites: <any> '',
      contractorList: <any> '',
      loadRecords: <any> '',
      roomFeatures: <any> '',
      patchReq: <any> '',

    },
    modal:{
      title: '',
      message: ''
    },
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
    filterLabel: {
      beginDate:<any> new Date(),
      endDate:<any> new Date(),
      siteID: 'None',
      businessProfileID: 'None',
      resourceTypeID: 'None',
      contractID: 'None',
      ContractSite: 'None',
      contractorID: 'None',
      includeHolds: false
    },
    massEditForm: {number: 0, roomType: '00000000-0000-0000-0000-000000000000' }
  }
  constructor( private renderer: Renderer2,
               private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser,
               public dvcService:DeviceDetectionService,
               private toastr: ToastrService
  ) {
    this.bsConfig = Object.assign({}, { dateInputFormat: 'MM/DD/YYYY',  showWeekNumbers: false });
    let date = new Date();
    this.state.filterForm.beginDate = new Date(date.setDate(date.getDate()))
    this.state.filterForm.endDate = new Date(date.setDate(date.getDate()+30))
  }

  ngOnInit(): void {
    this.loadSites();
    this.loadResources();
    this.loadBusinessProfiles();
  }

  ngOnDestroy(){
    this.resetFilter();
    this.state.resources.lookup && this.state.resources.lookup.unsubscribe();
    this.state.resources.resourceType && this.state.resources.resourceType.unsubscribe();
    this.state.resources.businessProfile && this.state.resources.businessProfile.unsubscribe();
    this.state.resources.contracts && this.state.resources.contracts.unsubscribe();
    this.state.resources.contractSites && this.state.resources.contractSites.unsubscribe();
    this.state.resources.contractorList && this.state.resources.contractorList.unsubscribe();
    this.state.resources.loadRecords && this.state.resources.loadRecords.unsubscribe();
    this.state.resources.roomFeatures && this.state.resources.roomFeatures.unsubscribe();
    this.state.resources.patchReq && this.state.resources.patchReq.unsubscribe();
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
    this.state.resources.lookup = this.lookupService.loadResources()
      .subscribe((res)=>{
        this.state.loading.resources = false;
        this.state.resourceTypes = res['data']['results'];
        this.state.filterForm.resourceTypeID = res['data']['results'][0].value;
        this.setToolTipValue('resourceTypeID', 'resourceTypes')
        this.setResourceType();
        this.state.filterForm.businessProfileID = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.contractorID = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.ContractSite = '00000000-0000-0000-0000-000000000000'
      })
  }

  setResourceType () {
    if(this.state.filterForm.resourceTypeID == '00000000-0000-0000-0000-000000000000'){
      this.resetFilter();
      return;
    }
    this.state.resources.resourceType = this.availService.getAvailabilityType(this.state.filterForm.resourceTypeID)
      .subscribe((res:any)=>{
        this.state.resourceTypeValue = res
        this.state.isMassEditting = false
        this.resetMassEdit();
      })
  }

  loadBusinessProfiles() {
    this.state.loading.ruleBag=true;
    this.state.resources.businessProfile = this.lookupService.loadBusinessProfile()
      .subscribe(res=> {
        this.state.loading.ruleBag=false;
        this.state.businessProfiles=res['data']['results'];
        this.state.filterForm.contractID = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.ContractSite = '00000000-0000-0000-0000-000000000000';
        this.state.filterForm.contractorID = '00000000-0000-0000-0000-000000000000';
      })
  }

  resetFilter() {
    this.resetMassEdit();
    this.remoteData = [];
    this.remoteDataTemp = [];
    this.state.isMassEditting = false;
    this.state.filterForm.businessProfileID = '00000000-0000-0000-0000-000000000000';
    this.state.filterForm.contractID = '00000000-0000-0000-0000-000000000000';
    this.state.filterForm.contractorID = '00000000-0000-0000-0000-000000000000';
    this.state.filterForm.ContractSite = '00000000-0000-0000-0000-000000000000'
  }

  loadContracts() {
    this.state.loading.contract = true;
    this.state.resources.contracts = this.lookupService.loadContracts({criteria: this.state.filterForm.businessProfileID})
      .subscribe((res)=>{
        this.state.loading.contract = false;
        this.state.contracts = res['data']['results'];
      })
  }

  loadContractSites() {
    this.state.loading.ContractSite = true;
    this.state.resources.contractSites = this.lookupService.loadContractSites({criteria: this.state.filterForm.contractID})
      .subscribe((res)=>{
        this.state.loading.ContractSite = false;
        this.state.ContractSites = res['data']['results'];
      })
  }

  loadContractorList () {
    this.state.loading.ContractorList = true;
    this.state.resources.contractorList = this.lookupService.loadContractorList({criteria: this.state.filterForm.businessProfileID})
      .subscribe((res)=>{
        this.state.loading.ContractorList = false;
        this.state.ContractorList = res['data']['results'];
      })
  }

  loadRecords (avtiveIndex= 0, includeHolds=false) {
    if(this.state.loading.records == true) return;
    this.availService.resetErrors();
    if(!this.availService.validateFilters(this.state.filterForm, this.state.resourceTypeValue)){
      this.state.errorMessages = this.availService.getErrorMessages();
      this.childcomp.openAlertModal()
      return;
    }
    this.resetMassEdit()
    if(this.dvcService.isMobile()){
      this.closeFilterBar();
    }
    let beginDate = this.dateParser.formatDate(this.state.filterForm.beginDate);
    let endDate = this.dateParser.formatDate(this.state.filterForm.endDate);
    this.state.filterForm.includeHolds= includeHolds;
    this.state.loading.records = true;
    this.state.resources.loadRecords = this.availService.loadRecords(this.state.filterForm.siteID,
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
    //console.log("setting edit mode");
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
    this.loadRoomFeatures(this.state.resourceTypeValue);
    return;
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
    this.state.resources.roomFeatures = this.availService.loadRoomFeatures(this.state.filterForm.ContractSite, resourceType)
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

    if(isNaN(Number(this.state.massEditForm.number))){
      this.toastr.error('field should contain number');
      return;
    }
    if(this.state.isMassEditting && (this.state.resourceTypeValue == 1 && this.state.massEditForm.roomType == '00000000-0000-0000-0000-000000000000')) {
      this.toastr.error('Select room type to continue');
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
                "hold": Math.round(Number(this.state.massEditForm.number)),
                "id": feature.id,
                "number": feature.number,
                "checked": feature.checked
              };
            }
            else if(feature.checked && !this.state.isMassEditting) {
              return {
                "hold": Math.round(Number(feature.hold)),
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
          if(this.state.isMassEditting) { row.total = Number(this.state.massEditForm.number) }
          return row
        }
      });
    }
    console.log(postBody)

    this.state.loading.save = true;
    this.state.resources.patchReq = this.availService.patchAvailabilityRecord(postBody, this.state.filterForm.siteID,
      this.state.filterForm.contractID,
      this.state.filterForm.contractorID,
      this.state.filterForm.resourceTypeID)
      .subscribe(res=>{
        if(typeof res == 'string') {
          this.state.modal.title ="Error!";
          this.state.modal.message = "Invalid format of response";
          this.modalComp.openModal();
          return;
        }

        console.log(res)
        this.state.loading.save = false;
        if(res['success']){
          this.state.modal.title ="Success!";
          this.state.modal.message ="Record has been updated";
        } else {
          this.state.modal.title ="Error!";
          this.state.modal.message =res['message'];
        }
        this.modalComp.openModal();
      },
        err=> {

          console.log(err)
          if(typeof err == 'string') {
            this.state.modal.title ="Error!";
            this.state.modal.message = "Invalid format of response";
            this.modalComp.openModal();
            return;
          }
          this.state.loading.save = false;
          this.state.modal.title ="Error!";
          this.state.modal.message = "Something went wrong, please try again!";
          this.modalComp.openModal();
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

  setMultipleSelect(event){
    console.log(JSON.parse(event));
    return;
    //index, room, $event, column
    let index, room, $event, column
    if(column.canEdit && column.dataProperty != 'FdStatus') return;
    console.log("selecting ", index, this.state.massEdit.lastIndex)
    this.state.massEdit.lastIndex=index;

  }

  completeMultipleSelect(event){
    if(!this.state.filterForm.includeHolds) return;
    event = JSON.parse(event);

    let start = event.start;
    let limit = event.limit;
    let shiftKey = event.shiftKey;
    if(shiftKey && event.start > event.limit) {
      start = event.limit;
      limit = event.start;
    }
    start = shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : start;
    if(shiftKey && start > event.limit) {
      start = event.limit;
      limit = this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]-1;
    }
    //let flag = $event.shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : this.state.massEdit.lastIndex;
    if(this.state.resourceTypeValue == 1) {
      for(let index=start; index<=limit; index++) {
        let flag = this.state.massEdit.indexes.indexOf(index);
        if(flag == -1) {
          this.remoteData.data[index]['checked'] = true;
          this.state.massEdit.items.push(this.remoteData.data[index]);
          this.state.massEdit.indexes.push(index);
        } else {
          this.remoteData.data[index]['checked'] = false
          this.state.massEdit.items.splice(flag, 1);
          this.state.massEdit.indexes.splice(flag, 1);
        }
      }
    }
    else {
      //start = shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : start;
      for(let index=start; index<=limit; index++) {
        //this.remoteData.filter((row)=> {
        let flag = this.state.massEdit.indexes.indexOf(index);
        if(flag == -1) {
          this.remoteData[index]['checked'] = true;
          this.state.massEdit.items.push(this.remoteData[index]);
          this.state.massEdit.indexes.push(index);
        } else {
          this.remoteData[index]['checked'] = false
          this.state.massEdit.items.splice(flag, 1);
          this.state.massEdit.indexes.splice(flag, 1);
        }
      }
    }
    if(this.state.massEdit.items.length <= 0){
      this.resetMassEdit();
      this.toastr.warning("There is no record selected for mass edit operation", 'Warning!');
    }
    return;
  }

  resetMassEdit() {
    if(this.state.resourceTypeValue == 1) {
      this.state.massEdit.indexes.filter(index => {
        this.remoteData.data[index]['checked'] = false
      });
    }
    else {
      //console.log(this.remoteData)
      this.state.massEdit.indexes.filter(index => {
        this.remoteData[index]['checked'] = false
      })
    }
    this.state.massEdit.items= [];
    this.state.massEdit.indexes= []
    this.state.isMassEditting=false;
    return;
  }

  processMassEdit () {
    //this.state.isMassEditting = false;
    if(this.state.resourceTypeValue == 1 && (this.state.massEditForm.roomType == '00000000-0000-0000-0000-000000000000' || Number(this.state.massEditForm.number) <= 0 || Number(this.state.massEditForm.number) == NaN)) {
        let message = [];
        if(this.state.massEditForm.roomType == '00000000-0000-0000-0000-000000000000'){
          message.push("Please select Room Type before proceed")
        }
        if(Number(this.state.massEditForm.number) <= 0){
          message.push("Number should be greater than 0")
        }

        this.state.modal.title = "Validation Error!"
        this.state.modal.message = message.join("\n");
        this.modalComp.openModal();
        return false;
    }
    else if(this.state.resourceTypeValue == 2 && Number(this.state.massEditForm.number) < 0){
      this.state.modal.title = "Validation Error!"
      this.state.modal.message = "Number should be greater than 0"
      this.modalComp.openModal();
      return false;
    }
    this.saveChanges();
  }

  updateRow(event) {

    let data = JSON.parse(event)
      //row: row, feature: feature, index:index
    if(this.state.resourceTypeValue == 1) {
      if(this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processing_'+data['property']]) return;
      //this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] = this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] == -1 ? null : this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']];
      //check on string
      if(!this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processed_'+data['property']] &&
        isNaN(Number(this.remoteData.data[data['index']]['features'][data['featureIndex']][data['property']])) ) {
        this.remoteData.data[data['index']]['features'][data['featureIndex']][data['property']] = this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] == -1 ? null : this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']];
        this.toastr.error('field should contain number');
        return;
      }
      if(!data['forceRedo'] && this.remoteData.data[data['index']]['features'][data['featureIndex']][data['property']] == (this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] == -1 ? null : this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']]) ) return;
      this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processing_'+data['property']] = true;
      clearTimeout(this.remoteData.data[data['index']]['features'][data['featureIndex']]['$timeout']);
      delete this.remoteData.data[data['index']]['features'][data['featureIndex']]['$timeout'];
      this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processed_'+data['property']] = false;
      //this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] = this.remoteData.data[data['index']]['features'][data['featureIndex']][data['property']]
    }
    else {
      if(this.remoteData[data['index']]['$processing_'+data['property']]) return;
      //this.remoteData[data['index']]['$old_'+data['property']] = this.remoteData[data['index']]['$old_'+data['property']] == -1 ? null : this.remoteData[data['index']]['$old_'+data['property']]
      //
      if(!this.remoteData[data['index']]['$processed_'+data['property']] &&
        isNaN(Number(this.remoteData[data['index']][data['property']])) ) {
        this.remoteData[data['index']][data['property']] = this.remoteData[data['index']]['$old_'+data['property']] == -1 ? null : this.remoteData[data['index']]['$old_'+data['property']];
        this.toastr.error('field should contain number');
        return;
      }
      if(!data['forceRedo'] && (this.remoteData[data['index']]['$old_'+data['property']] == -1 ? null : this.remoteData[data['index']]['$old_'+data['property']]) == this.remoteData[data['index']][data['property']]) return;
      this.remoteData[data['index']]['$processing_'+data['property']] = true;
      clearTimeout(this.remoteData[data['index']]['$timeout'])
      delete this.remoteData[data['index']]['$timeout'];
      this.remoteData[data['index']]['$processed_'+data['property']] = false;
      //this.remoteData[data['index']]['$old_'+data['property']] = this.remoteData[data['index']][data['property']];
    }
    let postBody = [];

    if(this.state.resourceTypeValue == 1) {
      postBody = [{
        "AvailabilityDate": this.remoteData.data[data['index']].date,
        "Features" : [
          {
            "hold": Math.round(Number(data['feature'].hold)),
            "id": data['feature'].id,
            "number": data['feature'].number,
            "checked": data['feature'].checked
          }
        ],
      }]
    }
    else {
      /*let temp = JSON.parse(JSON.stringify(this.remoteData[data['index']]));
      delete temp['$type'];
      temp[data['property']] = Number(temp[data['property']]);*/
      this.remoteData[data['index']][data['property']] = Math.round(Number(this.remoteData[data['index']][data['property']]));
      postBody = [this.remoteData[data['index']]];
    }


    this.availService.patchAvailabilityRecord(postBody, this.state.filterForm.siteID,
      this.state.filterForm.contractID,
      this.state.filterForm.contractorID,
      this.state.filterForm.resourceTypeID)
      .subscribe(res=>{
          this.state.loading.save = false;
          if(res['success']){
            this.toastr.success('Record has been updated', 'Success!');
            if(this.state.resourceTypeValue == 1) {
              this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processing_'+data['property']] = false;
              this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processed_'+data['property']] = this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] != null;
              this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] = this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] == -1 ? null : this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']];
              if(this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] != null) {
                this.remoteData.data[data['index']]['features'][data['featureIndex']]['$timeout'] = setTimeout(() => {
                  this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_' + data['property']] = null
                  this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processed_' + data['property']] = false;
                  clearTimeout(this.remoteData.data[data['index']]['features'][data['featureIndex']]['$timeout']);
                }, 10000);
              }
            }
            else {
              this.remoteData[data['index']]['$processing_' + data['property']] = false;
              this.remoteData[data['index']]['$processed_' + data['property']] = this.remoteData[data['index']]['$old_' + data['property']] != null;
              this.remoteData[data['index']]['$old_' + data['property']] = this.remoteData[data['index']]['$old_' + data['property']] == -1 ? null : this.remoteData[data['index']]['$old_' + data['property']]
              if (this.remoteData[data['index']]['$old_' + data['property']] != null) {
                this.remoteData[data['index']]['$timeout'] = setTimeout(() => {
                  this.remoteData[data['index']]['$old_' + data['property']] = null
                  this.remoteData[data['index']]['$processed_' + data['property']] = false;
                  clearTimeout(this.remoteData[data['index']]['$timeout'])
                }, 10000);
              }
            }
          } else {
            this.handleErrorResponse(data);
            this.state.modal.title ="Error";
            this.state.modal.message =res['message'];
            this.toastr.error(res['message'], 'Error!');
          }
          //this.modalComp.openModal();
        },
        err=> {
          this.handleErrorResponse(data);
          this.state.modal.title ="Error!";
          this.state.modal.message = "Something went wrong, please try again!";
          this.toastr.error("Something went wrong, please try again!", 'Error!');
          this.modalComp.openModal();
        })
    return;
  }

  handleErrorResponse (data) {
    if(this.state.resourceTypeValue == 1) {
      this.remoteData.data[data['index']]['features'][data['featureIndex']]['$processing_'+data['property']] = false;
      this.remoteData.data[data['index']]['features'][data['featureIndex']][data['property']] = this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] == -1 ? null : this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']]
      this.remoteData.data[data['index']]['features'][data['featureIndex']]['$old_'+data['property']] = null

    }
    else {
      this.remoteData[data['index']]['$processing_'+data['property']] = false;
      this.remoteData[data['index']][data['property']] = this.remoteData[data['index']]['$old_'+data['property']] == -1 ? null : this.remoteData[data['index']]['$old_'+data['property']];
      this.remoteData[data['index']]['$old'+data['property']] = null;
    }
  }

  closeModal(){
    this.modalComp.state.open=false;
  }

  closeFilterBar(){
    this.renderer.addClass(document.body, 'menu-fullwidth')
  }
  openFilterBar () {
    //$(document).find('.header-wrap > .menu-icon ').trigger('click');
    //document.getElementById('widthSwitch').click();
    this.renderer.removeClass(document.body, 'menu-fullwidth')
  }

  setToolTipValue( model, list) {
    this.state[list].filter((item)=>{
      if(item.value == this.state.filterForm[model]){
        this.state.filterLabel[model] = item.text;
      }
    })
  }

}
