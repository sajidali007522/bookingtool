import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import * as $ from 'jquery'
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import {AlertModalComponent} from "../../../shared/alert-modal/alert-modal.component";

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
  constructor( private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser
  ) {
    this.bsConfig = Object.assign({}, { dateInputFormat: 'MM/DD/YYYY' });
    let date = new Date();
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
    if(!this.availService.validateFilters(this.state.filterForm, this.state.resourceTypeValue) ){ return; }
    let beginDate = this.state.filterForm.beginDate.getFullYear()+"-"+(this.state.filterForm.beginDate.getMonth()+1)+"-"+this.state.filterForm.beginDate.getDay();
    let endDate = this.state.filterForm.endDate.getFullYear()+"-"+(this.state.filterForm.endDate.getMonth()+1)+"-"+this.state.filterForm.endDate.getDay();
    this.state.loading.records = true;
    this.availService.loadRecords(this.state.filterForm.siteID,
      this.state.filterForm.contractID,
      this.state.filterForm.resourceTypeID,
      this.state.filterForm.contractorID,
      {
        beginDate: beginDate,
        endDate: endDate,
        includeHold: this.state.filterForm.includeHolds
      })
      .subscribe(res=> {
        this.state.recordLoaded=true;
        this.remoteData = res;
        console.log(res)
      },
        err=>{console.log(err)},
        ()=>{this.state.loading.records = false;}
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
  }

  setMassEdit(){
    if(this.remoteData.length <= 0 ) return;
    this.remoteDataTemp = JSON.parse(JSON.stringify(this.remoteData));
    this.state.isMassEditting= true;
  }

  selectNone(){
    this.remoteData.filter(row=>{
      row.checked = false
    })
  }
  selectAll(){
    this.remoteData.filter(row=>{
      row.checked = true
    })
  }

  saveChanges(){

  }
}
