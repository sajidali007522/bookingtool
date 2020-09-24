import {Component, OnInit} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {

  state={
    resourceTypes: [],//lookup=ResourceType
    billingProfiles: [], //lookup=RuleBagContract
    contracts: [], //
    filterForm: {
      ResourceTypeID: '',
      BillingProfileID: '',
    }
  }
  constructor( private lookupService: LookupService
  ) {
  }

  ngOnInit(): void {
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

}
