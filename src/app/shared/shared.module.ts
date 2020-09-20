import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { Ng5SliderModule } from 'ng5-slider';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgxBootstrapSliderModule,
    Ng5SliderModule,
    NgxPaginationModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgxBootstrapSliderModule,
    Ng5SliderModule,
    NgxPaginationModule
  ]
})
export class SharedModule { }
