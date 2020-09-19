import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() className?: string;
  constructor() { }

  ngOnInit(): void {
    //console.log(this.className);
    this.className = this.className ? 'loader '+this.className : 'loader loader-lg';
  }

}
