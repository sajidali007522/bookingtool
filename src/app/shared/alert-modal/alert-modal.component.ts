import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {
  @Input() messages;
  @Output() closeIt=new EventEmitter<boolean>();

  state = {
    open: false
  }

  constructor() { }

  ngOnInit(): void {
  }

  openAlertModal () {
    this.state.open=true;
  }

  closeModal () {
    this.state.open=false;
  }

}
