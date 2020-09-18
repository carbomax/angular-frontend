import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { Ng5SliderModule } from 'ng5-slider';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxBootstrapSliderModule,
    Ng5SliderModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    NgxBootstrapSliderModule,
    Ng5SliderModule,
    FormsModule

  ]
})
export class SharedModule { }
