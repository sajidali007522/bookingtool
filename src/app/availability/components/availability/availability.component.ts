import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit, AfterViewInit {

  state={
    loading: {
      sites:false,
      ruleBag: false,
      resources: false,
      billingProfiles: false,
      lodge: false,
      contractor: false
    },
    resourceTypes: [],//lookup=ResourceType
    billingProfiles: [], //lookup=RuleBagContract
    contracts: [], //
    sites: [],
    rules: [],
    lodges: [],
    filterForm: {
      ResourceTypeID: '',
      BillingProfileID: '00000000-0000-0000-0000-000000000000',
      contractID: '',
      RuleBagID: '',
      siteID: '',
      lodgeID: ''
    }
  }
  constructor( private lookupService: LookupService,
               private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.state.loading.sites = true;
    this.lookupService.loadSites()
    .subscribe((res)=>{
      this.state.sites = res['data']['results'];
      this.state.filterForm.siteID = res['data']['results'][0].value;
      this.state.loading.sites=false;
      this.loadResources();
      this.loadRuleBag();
    })
  }

  ngAfterViewInit() {}

  loadRuleBag() {
    this.state.loading.ruleBag=true;
    this.lookupService.loadRuleBag()
      .subscribe(res=> {
        this.state.loading.ruleBag=false;
        this.state.rules=res['data']['results'];
        this.state.filterForm.RuleBagID=res['data']['results'][0].value;
        this.loadProfiles();
        this.loadContracts();
      })
  }

  loadResources () {
    this.state.loading.resources = true;
    this.lookupService.loadResources()
      .subscribe((res)=>{
        this.state.loading.resources = false;
        this.state.resourceTypes = res['data']['results'];
        this.state.filterForm.ResourceTypeID = res['data']['results'][0].value;
      })
  }

  loadProfiles() {
    this.state.loading.billingProfiles = true;
    this.lookupService.loadProfiles({criteria: this.state.filterForm.RuleBagID}).subscribe((res) => {
      this.state.loading.billingProfiles = false;
      this.state.billingProfiles = res['data']['results'];
      this.state.filterForm.BillingProfileID = res['data']['results'][0].value;
      this.loadLodges();
    })
  }

  loadContracts () {
    this.state.loading.contractor = true;
    this.lookupService.loadContractLists({criteria: this.state.filterForm.RuleBagID}).subscribe((res) => {
      this.state.loading.contractor = false;
      this.state.contracts = res['data']['results'];
      this.state.filterForm.contractID = res['data']['results'][0].value;
    })
  }

  loadLodges () {
    this.state.loading.lodge = true;
    this.lookupService.loadLodges({criteria: this.state.filterForm.BillingProfileID}).subscribe((res) => {
      this.state.loading.lodge = false;
      this.state.lodges = res['data']['results'];
      this.state.filterForm.lodgeID = res['data']['results'][0].value;
    })
  }

}
