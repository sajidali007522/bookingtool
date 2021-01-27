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
  @Input() form;

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
    if(!this.field.minSearchCharacters && !this.field.numeric){
      this.getServerResponse('')
    }
    if(this.field.numeric) {
      this.field['model'] = '00000000-0000-0000-0000-000000000000'
      this.remoteList = [];
      for (let index=this.field.numeric.minimumValue; index<=this.field.numeric.maximumValue; index++){
        this.remoteList.push({value: index, text: index})
      }
    }
  }


  selectItem (item) {
    this.field['selectedValue'] = item;
    this.field['model'] = item;
    this.form[this.field['name'].split(' ').join('_')] = item;
  }

  getServerResponse(event= '') {
    //console.log(event)
    this.error = {};
    this.field['processing'] = true;
    let body =[]

    if(this.field.fieldRelation.indexOf('Arrival') != -1 ) {
      //console.log(this.form)
      if(this.form['Departure']) {
        body.push({
          "relation": "DepartureAirport",
          "selection": this.form['Departure'].value,
          "type": 1,
          "selectionText": this.form['Departure'].text
        })
      }
    }

    let params = {searchTerm: event};
    //console.log(this.bookingID)
    this.lookupService.findResults(this.bookingID, body, {
      definitionType: 0,
      resourceTypeID: this.resourceType,
      searchCriteriaID: this.field['searchCriteriaID'],
      filter: event
    })
      .subscribe(
        res=>{
          //console.log(res['data'].results)
          this.field['processing'] = false;
          this.remoteList = res['data'].results
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
