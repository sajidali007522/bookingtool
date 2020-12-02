import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import 'hammerjs'

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit,AfterViewInit {

  @Input() remoteData:any;
  @Input() state:any;

  @Output() nextPage = new EventEmitter<string>();
  @Output() prevPage = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() endEdit = new EventEmitter<string>();
  @Output() save = new EventEmitter<string>();

  @Output() startSelection = new EventEmitter<string>();
  @Output() completeSelection = new EventEmitter<string>();
  @Output() updateRow = new EventEmitter<string>();

  componentState = {
    start: -1,
    limit: -1
  }
  constructor( private lookupService: LookupService,
               private availService: AvailabilityService,
               public dateParser: DateParser
  ) {

  }

  ngOnInit(): void {
    /*const hammerConfig = new HammerGestureConfig()
    //or if you use another class as provider:
    //    const hammerConfig=new MyHammerConfig()

    const hammer=hammerConfig.buildHammer(document.documentElement)
    fromEvent(hammer, "swipe").pipe(
      takeWhile(()=>true))
      .subscribe((res: any) => {
        console.log(res.deltaX);
      });*/
  }

  ngAfterViewInit() {
    //this.setCardCellTitle()
  }


  getResourceType() {
    let data = this.state.resourceTypes.filter(resource => {
      if (resource.value == this.state.filterForm.resourceTypeID){
        return resource;
      }
    })
    return data[0].text;
  }

  swipeNext() {
    console.log("over here");
    this.nextPage.emit('nexPage');
  }

  swipePrev() {
    console.log("over here too");
    this.prevPage.emit('prevPage');
  }

  setEdit () {
    this.edit.emit('setEdit');
  }

  resetEdit () {
    this.endEdit.emit('endEdit');
  }

  callSave () {
    this.save.emit('save');
  }

  rowSelection (row, index) {
    this.componentState.start = index;
    //this.startSelection.emit(JSON.stringify({row: row, index:index}))
  }
  rowCompletion (row, index) {
    if(this.state.isMassEditting) return;
    this.completeSelection.emit(JSON.stringify({row: row, start:this.componentState.start, limit: index}))
  }
  setCardCellTitle() {

  }

  setAsSelected (item, feature) {
    item.checked = true;
    feature.checked=true;
  }

  updateRecord(row, feature, index) {
    this.updateRow.emit(JSON.stringify({row: row, feature: feature, index:index}))
  }

  removeFromMassEdit(row, index) {
    this.completeSelection.emit(JSON.stringify({row: row, start: index, limit: index}))
  }
}
