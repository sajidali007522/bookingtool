import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  @Input()  public nodes;
  @Input() public myCallback: Function;

  constructor() { }

  ngOnInit(): void {
  }

  reTriggerCallBack (category, $event): void {
    this.myCallback(category, $event);
  }

}
