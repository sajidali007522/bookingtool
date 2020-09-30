import {Component, Input, OnInit} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  @Input() remoteData:any;
  @Input() state:any;

  constructor( private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser
  ) {}

  ngOnInit(): void {
  }

}
