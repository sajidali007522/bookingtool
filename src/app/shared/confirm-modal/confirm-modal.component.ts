import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  @Input() confirmationMessage;
  @Output() isConfirmed=new EventEmitter<boolean>();

  state = {
    open: false
  }
  constructor() { }

  ngOnInit(): void {
  }

  openModal () {
    this.state.open=true;
  }

  deleteImage(isConfirmed) {
    this.state.open=false;
    this.isConfirmed.emit(isConfirmed);
  }


}
