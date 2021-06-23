import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import * as $ from "jquery";
import {Router} from "@angular/router";
import {ConfigService} from "../../config.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor (private renderer: Renderer2,
               private appConfigService: ConfigService ) {

  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.addJsToElement(`${this.appConfigService.baseUrl}assets/js/home.js`);
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

}
