import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor (private renderer: Renderer2) {

  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.addJsToElement('/booking-tool/assets/js/home.js');
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

}
