import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit, AfterViewInit {

  state={
    resourceTypes: [],//lookup=ResourceType
    billingProfiles: [], //lookup=RuleBagContract
    contracts: [], //
    sites: [],
    filterForm: {
      ResourceTypeID: '',
      BillingProfileID: '',
      contractID: '',
      siteID: ''
    }
  }
  constructor( private lookupService: LookupService,
               private ref: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.lookupService.loadSites()
    .subscribe((res)=>{
      this.state.sites = res['data']['results'];
      this.state.filterForm.siteID = res['data']['results'][0].value;
    })
  }

  ngAfterViewInit() {
    this.loadResources();
    this.loadProfiles();
  }

  loadResources () {
    this.lookupService.loadResources()
      .subscribe((res)=>{
        this.state.resourceTypes = res['data']['results'];
        this.state.filterForm.ResourceTypeID = res['data']['results'][0].value;
      })
  }

  loadProfiles() {
    this.lookupService.loadProfiles().subscribe((res) => {
      this.state.billingProfiles = res['data']['results'];
      this.state.filterForm.BillingProfileID = res['data']['results'][0].value;
    })
  }

  loadContracts () {
    this.lookupService.loadContractLists().subscribe((res) => {
      this.state.contracts = res['data']['results'];
      this.state.filterForm.contractID = res['data']['results'][0].value;
    })
  }

}
