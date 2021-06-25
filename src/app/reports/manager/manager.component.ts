import {AfterViewChecked, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ConfigService} from "../../config.service";
import {ReportsService} from "../../_services/reports.service";
import {LookupService} from "../../_services/lookupService";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {UserService} from "../../_services/user.service";

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
  error;
  reportTemplate= {}
  form ={
    template:{},
    exportType:{}
  }
  state={
    manager: '',
    loading: false,
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
                      this.reportTemplate['reportFields'][index]['model'] = ''
                      this.reportTemplate['reportFields'][index]['loading'] = false
                      this.reportTemplate['reportFields'][index]['options'] = res['data']['results'];
                    })
              }
            this.reportTemplate['reportFields'][index]['model'] = ''
            this.reportTemplate['reportFields'][index]['loading'] = true
          }
          for (let index=0; index<this.state.exportTypes.length; index++){
            if(this.reportTemplate['exportFileTypes'].indexOf(this.state.exportTypes[index].code) != -1){
              this.state.exportTypes.splice(index, 1);
            }
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

  exportReport(){
    if(this.state.loading) return;
    this.state.loading = true;
    let body=this.preparePostBody();
    this.reportService.exportReports(this.state.manager.charAt(0).toUpperCase() + this.state.manager.slice(1),body)
      .subscribe(res => {
          this.state.loading = false;
        },
        (error)=>{
          this.state.loading = false;
        }
      );
  }

  preparePostBody() {
    let body = {
        "criteriaClass": this.reportTemplate['criteriaClass'],
        "renderingClass": "string",
        "reportName": this.form.template['name'],
        "exportType": this.form.exportType['code'],
        "reportFields": []
    }
      this.reportTemplate['reportFields'].filter(item=>{
        body.reportFields.push(
          {
            "propertyName": item.property,
            "value": item.model
          })
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
