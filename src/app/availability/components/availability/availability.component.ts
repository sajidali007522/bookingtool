import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import * as $ from 'jquery'
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import {AlertModalComponent} from "../../../shared/alert-modal/alert-modal.component";
import {DeviceDetectionService} from "../../../_services/device-detection.service";

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
    mobileContainer: <any>[],
    recordVisible: 0,
    errorMessages: [],
    resourceTypeValue: 0,
    isMassEditting: false,
    recordLoaded: false,
    isEditting: false,
    minDate: new Date(),
    loading: {
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
    massEditForm: {number: 0 }
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
    $(".accordion-group .accordon-heading").on('click', function(){
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

  loadRecords () {
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
        if(this.dvcService.isMobile()) {
          if(this.state.resourceTypeValue == 1) {
            this.remoteData['data'] = [res['data'][0]]
          } else {
            this.remoteData = [res[0]];
          }
          this.state.mobileContainer = res;
          this.state.recordVisible = 0;
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

  setEditMode(){
    if(this.remoteData.length <= 0 ) return;
    this.remoteDataTemp = JSON.parse(JSON.stringify(this.remoteData));
    this.state.isEditting= true;
  }

  resetEditMode () {
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
    this.loadRecords();
    this.state.isMassEditting= true;
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

  }
  public nextPage(event) {
    if(!this.dvcService.isMobile()) return;
    if(this.state.recordVisible >= this.state.mobileContainer.length) { return; }
    this.state.recordVisible++
    if(this.state.resourceTypeValue == 1) {
      this.remoteData['data'] = [this.state.mobileContainer['data'][this.state.recordVisible]];
    } else {
      this.remoteData = [this.state.mobileContainer[this.state.recordVisible]];
    }
  }
  public previousPage(event) {
    if(!this.dvcService.isMobile()) return;
    if(this.state.recordVisible <= 0) {return;}
    this.state.recordVisible--
    if(this.state.resourceTypeValue == 1) {
      this.remoteData['data'] = [this.state.mobileContainer['data'][this.state.recordVisible]];
    } else {
      this.remoteData = [this.state.mobileContainer[this.state.recordVisible]];
    }
  }
}
