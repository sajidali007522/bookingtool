import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  @Input() field
  @Input() resourceType
  @Input() index=-1
  @Input() fieldIndex=-1
  @Input() bookingID
  @Input() form;
  @Input() definitionType=0
  @Input() wrapClasses='field-wrap-outer field-gray-wrap'

  @Output() fieldBinding = new EventEmitter<string>();

  constructor (public lookupService:LookupService) { }

  remoteList = []
  error= {}
  keyword="text";
  templateId = 'itemTemplateRemote_'
  notFoundTemplate = 'notFoundTemplate_'
  fieldType= '';
  isLoadingResult=false;
  canceller;

  public errorMsg;
  ngOnInit(): void {
    //console.log(this.bookingID)
    this.field['keyword'] = ''
    this.templateId=this.templateId+this.index;
    this.notFoundTemplate=this.notFoundTemplate+this.index;
    this.field['model'] = ''
    this.field['visible'] = true;
    //
    if( this.field.numeric){
      this.fieldType = 'number'
    }
    else if( this.field.minSearchCharacters && this.field.isLookupSearch){
      this.fieldType = 'auto-complete'
    }
    else if(!this.field.minSearchCharacters && this.field.isLookupSearch ){
      this.fieldType = 'dropdown'
    }
    else if(!this.field.minSearchCharacters && !this.field.numeric && !this.field.isLookupSearch && this.field.allowFreeText) {
      this.fieldType = 'text'
    }

    if(this.fieldType == 'dropdown'){
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
    this.field['validationError'] = 'passed'
  }
  checkValidationError(){
    if(this.field.model != '' && this.field.model != '00000000-0000-0000-0000-000000000000'){
      this.field['validationError'] = 'passed'
    }
  }
  getServerResponse(event= '') {
    console.log(event)
    if(event.length<=0) return;
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
    console.log(this.bookingID)
    if(this.canceller){
      this.canceller.unsubscribe();
    }
    this.canceller = this.lookupService.findResults(this.bookingID, body, {
      definitionType: this.definitionType,
      resourceTypeID: this.resourceType,
      searchCriteriaID: this.field['searchCriteriaID'],
      filter: event
    })
      .subscribe(
        res=>{
          //console.log(res['data'].results)
          this.field['processing'] = false;
          this.remoteList = res['data'].results
          if(res['data'].results.length == 0 && (!this.field.minSearchCharacters && !this.field.allowFreeText)){
            this.field['visible'] = this.field.isRequired == true
            this.setField();
          }
          if(this.remoteList.length == 1) {
            this.field['model'] =this.remoteList[0]
          }
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
    this.field.model = ''
  }

  onFocused(e){
    // do something when input is focused
  }

  setField () {
    this.fieldBinding.emit(JSON.stringify({
      field: this.field,
      fieldIndex:this.fieldIndex,
      resourceIndex: this.index
    }));
  }

  setDateTo () {
    //this.form.EndDate = this.form.BeginDate;
  }

}
