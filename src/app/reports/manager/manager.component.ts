import {AfterViewChecked, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ConfigService} from "../../config.service";
import {ReportsService} from "../../_services/reports.service";
import {LookupService} from "../../_services/lookupService";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {UserService} from "../../_services/user.service";
import * as $ from 'jquery';

import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit, AfterViewChecked {

  bsConfig: Partial<BsDatepickerConfig>;
  minDateFrom= new Date();
  maxDateFrom= new Date();
  minDateTo: Date;
  viewUrl;
  error;
  reportTemplate= {}
  form ={
    template:'',
    exportType:{ code: -1}
  }
  state={
    manager: '',
    loading: false,
    errors: {},
    exportTypes:[
      {label: 'PDF', code: 0,},
      {label: 'Excel', code: 1},
      {label: 'CSV', code:  2},
      {label: 'Word', code: 3},
      {label: 'XML', code: 4}
    ]
  }
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private configService: ConfigService,
              private reportService: ReportsService,
              private lookupSer: LookupService,
              public userService:UserService,
  ) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      isAnimated: true,
      showPreviousMonth: false,
      showWeekNumbers:false,
    }
    let dateFormat = this.userService.getSettingByProp('dateFormat')
    if(dateFormat){
      this.bsConfig['dateInputFormat'] = dateFormat;
    }
    this.maxDateFrom.setDate(5*365)
    this.route.params.subscribe(params => {
      this.state.manager = params['report_manager'];
      this.loadReportTemplate(this.state.manager.charAt(0).toUpperCase() + this.state.manager.slice(1))
    });
  }

  loadReportTemplate(reportManager) {
    if(this.state.loading) return;
    this.state.loading = true;
    this.reportService.getReports(reportManager)
      .subscribe(res => {
          this.state.loading = false;
          this.reportTemplate = res['data'];
          //this.form.templateId = this.reportTemplate['reportTemplates'][0]['templateId'];
          for(let index=0; index<res['data']['reportFields'].length; index++){
              if(res['data']['reportFields'][index]['lookupName'] && !res['data']['reportFields'][index].minSearchCharacters) {
                  this.lookupSer.hitLookup(res['data']['reportFields'][index]['lookupName'], {criteria: res['data']['reportFields'][index]['lookupCriteria']})
                    .subscribe(res => {
                      this.reportTemplate['reportFields'][index]['loading'] = false
                      this.reportTemplate['reportFields'][index]['options'] = res['data']['results'];
                    })
              }
            this.reportTemplate['reportFields'][index]['model'] = this.reportTemplate['reportFields'][index].nullValue || ''
            if(this.reportTemplate['reportFields'][index].type == 1){
              this.reportTemplate['reportFields'][index]['model'] = new Date()
            }
            if(this.reportTemplate['reportFields'][index].type == 2){
              this.reportTemplate['reportFields'][index]['model'] = false
            }
            this.reportTemplate['reportFields'][index]['loading'] = true
          }
          for (let index=0; index<this.state.exportTypes.length; index++){
            if(this.reportTemplate['exportFileTypes'].indexOf(this.state.exportTypes[index].code) != -1){
              this.state.exportTypes.splice(index, 1);
            }
          }
          if(this.reportTemplate['reportTemplates'].length > 0) {
            this.form.template = this.reportTemplate['reportTemplates'][0].templateID
          }
        },
        (error)=>{
          this.state.loading = false;
        }
      );
  }

  setExportType(type) {
    this.form.exportType=type;
  }

  exportReport (viewPdf=false) {
    if(this.state.loading) return;
    if(viewPdf){
      this.setExportType(0);
    }

    if(!this.validateForm()){
      this.toastr.error('please select All required field first.', 'Error!')
      return;
    }
    this.state.loading = true;
    let body=this.preparePostBody();
    this.reportService.exportReports(this.state.manager.charAt(0).toUpperCase() + this.state.manager.slice(1),body)
      .subscribe(res => {
          this.state.loading = false;
          if(res['success']){
            if(!viewPdf) {
              window.open(res['data']['fileUrl'], '_blank');
            } else {
              this.viewUrl = res['data']['fileUrl']
              $(document).find(".pdf-modal-trigger").trigger("click");//.css({'display':'block'});
            }
          }
        },
        (error)=>{
          this.state.loading = false;
        }
      );
  }

  validateForm(){
    let validated=true;
    this.state.errors={}
    if(this.form.template == '') {
      this.state.errors['template'] = 'Please select report type to continue.'
      validated=false;
      return;
    }
    if(this.form.exportType['code']<0){
      this.state.errors['code'] = 'please select export file type.'
      validated=false;
      return;
    }
    this.reportTemplate['reportFields'].filter(item=>{
      item.error = ''
      if(item.isRequired && item.model == '') {
        item.error= 'Field is required.'
        validated=false;
      }
    });
    return validated
  }

  preparePostBody() {

    let body = {
        "criteriaClass": this.reportTemplate['criteriaClass'],
        "renderingClass": this.reportTemplate['renderingClass'],
        "exportType": this.form.exportType['code'],
        "reportFields": [{
          "propertyName": "ReportTemplateID",
          "value": this.form.template
        }]
    }
      this.reportTemplate['reportFields'].filter(item=>{
        let model = item.model
        if(item.type == 2) {
          model = item.model || false
        }
        if(!item.isRequired && item.model == ''){
          model = item.nullValue
        }
        if(item.property == 'BeginDate') {
          let selectedDate = new Date(item.model);
          model =  selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate()
        }
        if(model != false) {
          body.reportFields.push(
            {
              "propertyName": item.property,
              "value": model
            })
        }
      })

    return body;
  }

  toggleDropdown($event) {
    let isVisible = $($event.target).next('.dropdown-menu').is(":visible")
    if(isVisible){
      $($event.target).next('.dropdown-menu').hide();
    }
    else {
      $($event.target).next('.dropdown-menu').show();
    }
  }

  ngOnInit(): void {
  }
  ngAfterViewChecked() {
    $("body").click(function(e){
      if(!$(e.target).is('.exportOptions')) {
        $(".dropdown-menu").hide()
      }
    })
  }

}
