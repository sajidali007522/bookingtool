import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from "../../../http.service";
import {ConfirmModalComponent} from "../../../shared/confirm-modal/confirm-modal.component";
import {AuthenticationService} from "../../../_services/authentication.service";
import {ConfigService} from "../../../config.service";
import {ModalComponent} from "../../../shared-module/components/modal/modal.component";
import {DemoHousekeepingService} from "../../../_services/demo-housekeeping.service";
import {Lightbox, LightboxEvent, LIGHTBOX_EVENT} from 'ngx-lightbox';
import {Subscription} from "rxjs";
import {DateParser} from "../../../_helpers/dateParser";

@Component({
  selector: 'app-room-image',
  templateUrl: './room-image.component.html',
  styleUrls: ['./room-image.component.scss']
})

export class RoomImageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() siteId;
  @Input() room;
  @ViewChild(ConfirmModalComponent) childcomp: ConfirmModalComponent;
  @ViewChild(ModalComponent) modalComp: ModalComponent;

  private _subscription: Subscription;
  state={
    descriptionLimit: 150,
    message: '',
    isLoadingImages:false,
    roomImages: <any>[],
    selectedIndex: -1,
    selectedImage: <any>{
      roomNumber: '',
      description: '',
      createdDate: ''
    },
    componentState: {
      isViewMode: true,
      selectedImage:<any>{
        roomNumber: '',
        description: '',
        createdDate: ''
      }
    }
  };
  constructor(private _http: HttpService,
              private ref: ChangeDetectorRef,
              private appConfigService: ConfigService,
              private DHKService: DemoHousekeepingService,
              private _lightbox: Lightbox,
              private _lightboxEvent: LightboxEvent,
              private dateParser: DateParser) {}

  ngOnInit(): void {
    console.log("init")
  }
  ngOnChanges() {
    this.loadRoomImages();
    console.log(this.appConfigService)
  }
  ngOnDestroy() {
    this.state.roomImages = [];
    this.room = {};
  }

  openModal(){
    this.childcomp.openModal();
  }
  openAlertModal(){
    this.modalComp.openModal();
  }

  loadRoomImages() {
    if(this.siteId == '' || this.room.roomId == '' || this.state.isLoadingImages) {
      return;
    }
    this.state.isLoadingImages=true;
    this._http._get('housekeeping/'+this.siteId+'/RoomImages/'+this.room.roomId)
    //this.DHKService.loadRoomImages('housekeeping/'+this.siteId+'/RoomImages/'+this.room.roomId, {})
      .subscribe((data:any) => {
        this.state.roomImages = [];
        data.filter(r=> {
          //createDate
          // let d = new Date(Date.parse(r.createDate))
          // let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1;
          // let day = d.getDay() < 10 ? '0'+d.getDay() : d.getDay();
          // let hours = d.getHours() < 10 ? '0'+d.getHours() : d.getHours();
          // let minutes = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
          r.createDate = this.dateParser.parseDateStringToDate(r.createDate)
          //d.getFullYear()+"-"+month+"-"+day+" "+hours+":"+minutes;
          r.src = this.getThumbnailUrl(r.urlPath, 1000);
          r.thumb = this.getThumbnailUrl(r.urlPath, 100)
          this.state.roomImages.push(r);
        });
        this.reset();
        this.state.selectedImage = this.state.roomImages[this.state.roomImages.length-1];
        this.state.selectedIndex = this.state.roomImages.length-1;
        this.state.isLoadingImages = false;
        this.ref.detectChanges();
      },
      error => { console.log(error)},
      ()=>{this.state.isLoadingImages = false;console.log('completed')});
  }
  editImage(image, index) {
    if(!this.state.componentState.isViewMode) {
      this.reset();
    }
    this.state.selectedImage = image;
    this.state.selectedIndex = index;

  }

  save(){
    this.state.isLoadingImages = true;
    this.DHKService.saveRoom('housekeeping/'+this.siteId+'/RoomImage/'+this.room.roomId+'/'+this.state.selectedImage.documentArchiveIndexID, {},
      {
        name: this.state.selectedImage.name || '',
        description: this.state.selectedImage.description.substring(0,150) || ''
      })
    .subscribe(data => {
      this.state.componentState.isViewMode=true;
    },
      error => { console.log(error)},
    ()=>{
      this.state.isLoadingImages = false;
      console.log('completed');
      this.ref.detectChanges();
    });
  }

  edit(){
    this.state.componentState.isViewMode=false;
    this.state.componentState.selectedImage = JSON.parse(JSON.stringify(this.state.selectedImage));
    this.stripLength();
  }

  deleteImage(event) {
    //delete logic
    if(event) {
      this.state.isLoadingImages = true;
      this.DHKService.deleteRoomImage('housekeeping/'+this.siteId+'/RoomImage/'+this.room.roomId+'/'+this.state.selectedImage.documentArchiveIndexID,{})
        .subscribe(data => {
          this.state.roomImages.splice(this.state.selectedIndex, 1);
          this.state.selectedImage = this.state.roomImages[this.state.roomImages.length-1];
          this.state.selectedIndex = this.state.roomImages.length-1;
          this.state.componentState.isViewMode=true;
          this.state.isLoadingImages = false;
        },
        error => { console.log(error)},
        ()=>{
          this.state.isLoadingImages = false; this.ref.detectChanges();
          this.state.message = "Image has been deleted!"
          this.openAlertModal()
        });
    }
  }

  closeIt(event){}
  stripLength() {
    if(this.state.selectedImage.description.length >150) {
      this.state.selectedImage.description = this.state.selectedImage.description.substring(0, 150);
    }
    this.state.descriptionLimit = 150 - this.state.selectedImage.description.length;
  }

  reset(){
    this.state.componentState.isViewMode=true;
    if(this.state.componentState.selectedImage.roomNumber != '') {
      this.state.selectedImage = JSON.parse(JSON.stringify(this.state.componentState.selectedImage));
    }
  }

  getThumbnailUrl(src, size=100) {
    let temp = src.split(".");
    temp[temp.length-2] = temp[temp.length-2]+'_'+size;
    return temp.join(".");
  }


  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.state.roomImages, index);
    this._subscription = this._lightboxEvent.lightboxEvent$
      .subscribe(event => this._onReceivedEvent(event));
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  private _onReceivedEvent(event: any): void {
    // remember to unsubscribe the event when lightbox is closed
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      // event CLOSED is fired
      this._subscription.unsubscribe();
    }

    if (event.id === LIGHTBOX_EVENT.OPEN) {
      // event OPEN is fired
    }

    if (event.id === LIGHTBOX_EVENT.CHANGE_PAGE) {
      // event change page is fired
      console.log(event.data); // -> image index that lightbox is switched to
    }
  }
}
