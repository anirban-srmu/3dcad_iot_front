// Angular Import
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ResizableModule } from 'angular-resizable-element';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from './layout/shared/shared.module';
import { NonceInterceptor } from './shared/configuration/NonceInterceptor';
import { HttpInterceptorService } from './shared/HttpInterceptorService';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts'; // Import ECharts here
@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [BrowserModule,AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule,NgxScannerQrcodeModule ,SharedModule,BrowserAnimationsModule,ResizableModule,ToastMessageComponent],
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Register HttpClient and DI interceptors
      {
        provide: HTTP_INTERCEPTORS,
        useClass: NonceInterceptor,
        multi: true, // Ensure multiple interceptors are supported
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptorService,
        multi: true, // Ensure multiple interceptors are supported
      }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
