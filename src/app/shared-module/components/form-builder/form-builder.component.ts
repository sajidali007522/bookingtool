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
  keyword="text";
  templateId = 'itemTemplateRemote_'
  notFoundTemplate = 'notFoundTemplate_'
  isLoadingResult=false;

  public errorMsg;
  ngOnInit(): void {
    //console.log(this.bookingID)
    this.field['keyword'] = ''
    this.templateId=this.templateId+this.index;
    this.notFoundTemplate=this.notFoundTemplate+this.index;
    if(!this.field.minSearchCharacters){
      this.getServerResponse('')
    }
  }


  selectItem (item) {

  }

  getServerResponse(event= '') {
    console.log(event)
    this.error = {};
    this.field['processing'] = true;
    let params = {searchTerm: event};
    //console.log(this.bookingID)
    this.lookupService.findResults(this.bookingID, [], {
      definitionType: 0,
      resourceTypeID: this.resourceType,
      searchCriteriaID: this.field['searchCriteriaID'],
      filter: event
    })
      .subscribe(
        res=>{
          this.field['processing'] = false;
          this.remoteList = res['data']['results']
          //console.log(this.remoteList)
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
