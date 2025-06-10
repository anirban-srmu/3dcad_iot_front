import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addNonceToScripts(nonce: any) {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      this.renderer.setAttribute(script, 'nonce', nonce);
    });
  }
}
