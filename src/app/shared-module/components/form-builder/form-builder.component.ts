import {Component, Input, OnInit} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  @Input() field
  @Input() resourceType
  @Input() index
  @Input() bookingID

  constructor (public lookupService:LookupService) { }

  remoteList = []
  error= {}
  keyword="";
  isLoadingResult=false;

  public errorMsg;
  ngOnInit(): void {
    //console.log(this.bookingID)
    this.field['keyword'] = ''
  }


  selectItem (item) {

  }

  getServerResponse(event) {
    this.error = {};
    this.field['processing'] = true;
    console.log(this.field['keyword'])
    let params = {searchTerm: event};
    //console.log(this.bookingID)
    this.lookupService.findResults(this.bookingID, [{}], {
      definitionType: 0,
      resourceTypeID: this.resourceType,
      searchCriteriaID: this.field['searchCriteriaID'],
      filter: this.field['keyword']
    })
      .subscribe(
        res=>{
          this.field['processing'] = false;
        },
        err=>{
          this.field['processing'] = false;
          console.log(err)
        }
      )

  }
  searchCleared() {
    this.remoteList = []
  }

  onFocused(e){
    // do something when input is focused
  }

  setDateTo () {
    //this.form.EndDate = this.form.BeginDate;
  }

}
