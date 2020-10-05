import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import {MyHammerConfig} from "./../../availability.module"
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";
import { fromEvent } from "rxjs";
import {takeWhile} from "rxjs/operators"

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  @Input() remoteData:any;
  @Input() state:any;
  @Output() nextPage = new EventEmitter<string>();
  @Output() prevPage = new EventEmitter<string>();
  constructor( private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser
  ) {
    console.log(this.remoteData);
  }

  ngOnInit(): void {
  }

  swipeNext() {
    this.nextPage.emit('nexPage');
  }

  swipePrev() {
    this.prevPage.emit('prevPage');
  }

}
