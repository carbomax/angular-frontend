import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptorHttpService } from './services/auth.interceptor.http.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorHttpService, multi: true },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule

  ],
  providers: [
    httpInterceptorProviders
  ],
  exports: [HttpClientModule, CommonModule]
})
export class CoreModule { }
