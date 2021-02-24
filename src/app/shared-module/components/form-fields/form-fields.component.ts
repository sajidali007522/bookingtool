import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LookupService} from "../../../_services/lookupService";

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css']
})
export class FormFieldsComponent implements OnInit {
  @Input() field
  @Input() fieldDefinition={}
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
  isLoadingResult=false;
  fieldType= '';

  public errorMsg;
  ngOnInit(): void {
    this.setFieldType();
    //console.log(this.bookingID)
    this.field['keyword'] = ''
    this.field['checkedCount'] = 0
    this.templateId=this.templateId+this.index;
    this.notFoundTemplate=this.notFoundTemplate+this.index;
    this.field['model'] = ''
    this.field['visible'] = true;
    this.remoteList = this.fieldDefinition['results'];
    //if(this.fieldType == 'checkbox' || this.fieldType == 'dropdown'){
     // this.getServerResponse('')
    //}
    this.field['visible'] = this.fieldDefinition['isValidForSelection'] == true
    if(!this.field.isRequired && this.fieldDefinition['results'].length<=0 && (this.fieldType != 'autocomplete' && this.fieldType != 'text')){
      this.field['visible'] = false
    }

    if(this.field.numeric) {
      this.field['model'] = '00000000-0000-0000-0000-000000000000'
      this.remoteList = [];
      for (let index=this.field.numeric.minimumValue; index<=this.field.numeric.maximumValue; index++){
        this.remoteList.push({value: index, text: index})
      }
    }
    this.setModelValue()
  }

  setModelValue(){
    if(this.fieldType == 'text'){
      this.field.model = this.fieldDefinition['filterText']
      return;
    }
    this.remoteList.filter(item => {
      if(this.fieldDefinition['selectedValue'] && item.value == this.fieldDefinition['selectedValue']){
        this.field.model=item;
      }
    })
  }

  setFieldType() {
    this.fieldType;
    if(!this.field.isCheckbox && this.field.allowFreeText && this.field.minSearchCharacters && !this.field.isLookupSearch) { //is autocomplete
      this.fieldType = 'autocomplete'
    } else if(this.field.isLookupSearch && !this.field.allowFreeText){ //dropdown
      this.fieldType = 'dropdown'
    } else if(this.field.isCheckbox && this.field.allowFreeText) { //checkbox
      this.fieldType = 'checkbox'
    } else if(this.field.numeric ) { //numeric
      this.fieldType = 'number'
    } else { //text
      this.fieldType = 'text';
    }
  }

  selectItem (item) {
    this.field['selectedValue'] = item;
    this.field['model'] = item;
    this.form[this.field['name'].split(' ').join('_')] = item;
    this.setField()
    this.field['validationError'] = 'passed'
  }

  checkValidationError(){
    if(this.field.model != '' && this.field.model != '00000000-0000-0000-0000-000000000000'){
      this.field['validationError'] = 'passed'
    }
  }

  getServerResponse(event= '') {
    console.log(event)
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
            //this.field['visible'] = res['data']['isValidForSelection'] || this.field.isRequired == true
            this.setField();
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

  setValidation(){
    this.field.checkedCount = 0;
    this.remoteList.filter(item => {
      if(item.isChecked){
        this.field.checkedCount++
      }
    });
  }

  setCheckBoxValue(option){
    this.remoteList.filter(item => {
      if(item.value == option.value && item.isChecked) {
        this.field.model = option
      } else {
        item.isChecked = false;
      }
    });
  }

  setDateTo () {
    //this.form.EndDate = this.form.BeginDate;
  }

}
