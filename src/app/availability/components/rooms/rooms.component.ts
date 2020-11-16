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

  setMultipleSelect(index, room, $event){
    console.log("selecting ", index, this.state.massEdit.lastIndex)
    this.state.massEdit.lastIndex=index;

  }

  completeMultipleSelect(index, room, $event){
    //console.log("completing", index, this.state.massEdit.lastIndex);
    if(this.state.massEdit.lastIndex == -1) return;
    //if($event.shiftKey && $event.altKey) return;
    let flag = $event.shiftKey ? this.state.massEdit.indexes[this.state.massEdit.indexes.length-1]+1 : this.state.massEdit.lastIndex;
    while(flag <= index){
      this.handleMassEditRooms(flag, this.remoteData[flag])
      flag++;
    }
    this.state.massEdit.lastIndex = -1;
    return;
  }

  handleMassEditRooms (index, room) {
    if(this.state.massEdit.indexes.indexOf(index) != -1) {
      this.state.massEdit.indexes.splice(this.state.massEdit.indexes.indexOf(index), 1)
      this.state.massEdit.items.splice(this.state.massEdit.indexes.indexOf(index), 1)
      this.remoteData[index]['checked'] = false
      return;
    }
    this.state.massEdit.indexes.push(index)
    this.state.massEdit.items.push(room)
    //console.log(index,this.data[index])
    this.remoteData[index]['checked'] = true
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.getSelection()) {document.getSelection().empty();}
  }

  setCardCellTitle() {

  }

  setAsSelected (item, feature) {
    item.checked = true;
    feature.checked=true;
  }
}
