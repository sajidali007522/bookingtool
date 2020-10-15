import { Component, OnInit } from '@angular/core';
import {FlightSetupService} from "../../../_services/flight-setup.service";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {DateFormatsService} from "../../../_services/date-formats.service";
import {DateParser} from "../../../_helpers/dateParser";

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  form = {
    StartDate: new Date(),
    EndDate: new Date(),
  }
  bsConfig: Partial<BsDatepickerConfig>;
  state = {
    resourceType: 'Charter Flight',
    resource: '00000000-0000-0000-0000-000000000000',
    resourceItems: <any>[]
  }
  constructor(private setupService: FlightSetupService,
              public dateParser: DateParser) { }

  ngOnInit(): void {
    this.setupService.loadResourceTypes()
      .subscribe(res => {
        this.setupService.resourceTypes = res;
        this.state.resource = this.setupService.getResourceTypeId(this.state.resourceType)
      });
  }

  loadRecords () {
    let departure = new Date(this.form.StartDate);
    let arrival = new Date(this.form.EndDate);
    this.setupService.loadRecords(this.state.resource, {
      startDate: departure.getFullYear()+'-'+(departure.getMonth()+1)+"-"+departure.getDate(),
      endDate: arrival.getFullYear()+'-'+(arrival.getMonth()+1)+"-"+arrival.getDate(),
    })
      .subscribe(res => {
        console.log(res);
        this.state.resourceItems = res;
      })
  }

}
