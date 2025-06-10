import { Component, CSP_NONCE, HostListener, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NonceService } from './NonceService ';
import { TokenExpirationService } from './shared/TokenExpirationService ';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import { Config } from './configuration/env.config';
import { ApiService } from './Auth/authentication/sign-in/api.service';
import { DevToolsDetectionService } from './shared/configuration/DevToolsDetectionService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  nonce: any;

baseEndPoint:any
  sessionValid: any;
  constructor(private router: Router) {
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    this.baseEndPoint=Config.BaseEndpoint
  }
  canDisplay = false;

  isTemplate(toast: { textOrTpl: any; }) {
    return toast.textOrTpl instanceof TemplateRef;
    
  }
 
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  //  this.resetIdleTimer();
  }

   private setCspNonce(nonce: string | null) {
    const cspMeta = document.getElementById('csp-meta');
    if (cspMeta && nonce) {
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
 //     cspMeta.setAttribute('content', `default-src 'none'; script-src  'strict-dynamic'   'nonce-${nonce}'  https://taneiracatalogue.titan.in  'unsafe-inline' http: https:; style-src 'self' 'unsafe-inline'  ; style-src-elem 'self' 'unsafe-inline'  ; img-src 'self'  data: https://d32s7x5wk3u0m1.cloudfront.net ; font-src 'self'; connect-src 'self' ${this.baseEndPoint}; frame-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'`);
      cspMeta.setAttribute('content', `default-src 'none'; script-src  'strict-dynamic'   'nonce-${nonce}'  http://192.168.2.44:5300  'unsafe-inline' http: https:; style-src 'self' 'unsafe-inline'  ; style-src-elem 'self' 'unsafe-inline'  ; img-src 'self'  data: https://d32s7x5wk3u0m1.cloudfront.net ; font-src 'self'; connect-src 'self' ${this.baseEndPoint}; frame-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'`);
      document.head.appendChild(cspMeta);
    }
  }
  
  private handleStorageEvent(event: StorageEvent): void {
    if (event.key === 'logout') {
      // Clear session storage and redirect to login in this tab
      sessionStorage.clear();
      this.router.navigate(['/auth/signin']);
    }
  }


  
// working enable for production
//  @HostListener('contextmenu', ['$event'])
//  onRightClick(event: MouseEvent) {
//    event.preventDefault();
//   // this.toastr.warning('Right-click is disabled.', 'Warning');
//   this.triggerToast("Invalid", "Right-click is disabled.", "warning");
//  }
 
//  @HostListener('document:keydown', ['$event'])
//  onKeydown(event: KeyboardEvent) {
//    if (
//      event.key === 'F12' || 
//      (event.ctrlKey && event.shiftKey && event.key === 'I') || 
//      (event.ctrlKey && event.shiftKey && event.key === 'J') || 
//      (event.ctrlKey && event.key === 'U')
//    ) {
//      event.preventDefault();
//    //  this.toastr.error('Developer tools shortcuts are disabled.', 'Error');
//    this.triggerToast("Invalid", "Developer tools shortcuts are disabled.", "warning");
//    }
//  }

//  triggerToast(header: any, body: any, mess: any) {
//   this.toastMessageComponent.showToast(header, body, mess);
// }

}
