import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {LookupService} from "../../../_services/lookupService";
import {AvailabilityService} from "../../../_services/availability.service";
import {DateParser} from "../../../_helpers/dateParser";
import 'hammerjs'
import {ConfigService} from "../../../config.service";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {

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
               private appConfigService: ConfigService,
               public dateParser: DateParser
  ) {}

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
  getResourceType() {
    let data = this.state.resourceTypes.filter(resource => {
      if (resource.value == this.state.filterForm.resourceTypeID){
        return resource;
      }
    })
    return data[0].text;
  }

  swipeNext() {
    console.log("called")
    this.nextPage.emit('nexPage');
  }

  swipePrev() {
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

  setAsSelected (item) {
    item.checked = true;
  }
  isMobileDevice(){
    return this.appConfigService['userDevice'] == 'mobile';
  }
  rowSelection (row, index) {
    console.log("mouse down")
    this.componentState.start = index;
    //this.startSelection.emit(JSON.stringify({row: row, index:index}))
  }
  rowCompletion (row, index, $event) {
    if(this.state.isMassEditting) return;
    console.log("mouse up", this.componentState, index);
    //let flag = $event.shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : this.state.massEdit.lastIndex;
    this.completeSelection.emit(JSON.stringify({row: row, start:this.componentState.start, limit: index, shiftKey: $event.shiftKey}))
  }

  removeFromMassEdit(row, index) {
    //alert("over here travel");
    this.completeSelection.emit(JSON.stringify({row: row, start: index, limit: index}))
  }

  setCardCellTitle() {

  }

  updateRecord (row, index, property, forceRedo=false) {
    this.updateRow.emit(JSON.stringify({row: row, index:index, property: property, forceRedo:forceRedo}))
  }
}
