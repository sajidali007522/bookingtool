import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() message;
  @Output() closeIt=new EventEmitter<boolean>();

  state = {
    open: false
  }
  constructor() { }

  ngOnInit(): void {
  }

  openModal () {
    this.state.open=true;
  }

  closeModal() {
    this.state.open=false;
    this.closeIt.emit(false);
  }


}
