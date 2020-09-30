import {Component, Input, OnInit} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {LookupService} from "../../../_services/lookupService";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent implements OnInit {

  @Input() remoteData:any;
  @Input() state:any;

  constructor( private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser
  ) {}

  ngOnInit(): void {
  }

}
