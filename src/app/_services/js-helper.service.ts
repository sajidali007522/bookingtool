import {Injectable, Renderer2} from '@angular/core';

@Injectable()
export class jsHelperService {
  constructor(private renderer: Renderer2) {}

  addJsToElement(src: string): HTMLScriptElement {
    console.log(src);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }
}
