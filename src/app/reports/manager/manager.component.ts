import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ConfigService} from "../../config.service";
import {ReportsService} from "../../_services/reports.service";
import {LookupService} from "../../_services/lookupService";

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  error;
  reportTemplate= {}
  form ={
    templateId:''
  }
  state={
    manager: '',
    loading: false,

  }
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private configService: ConfigService,
              private reportService: ReportsService,
              private lookupSer: LookupService
  ) {
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
            this.reportTemplate['reportFields'][index]['model'] = ''
            this.reportTemplate['reportFields'][index]['loading'] = true
            if(res['data']['reportFields'][index]['lookupName']) {
              this.lookupSer.hitLookup(res['data']['reportFields'][index]['lookupName'], {criteria: res['data']['reportFields'][index]['lookupCriteria']})
                .subscribe(res => {
                  this.reportTemplate['reportFields'][index]['model'] = ''
                  this.reportTemplate['reportFields'][index]['loading'] = false
                  this.reportTemplate['reportFields'][index]['options'] = res['data']['results'];
                })
            }
          }
        },
        (error)=>{
          this.state.loading = false;
        }
      );
  }



  ngOnInit(): void {
  }

}
