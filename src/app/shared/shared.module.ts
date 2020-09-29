import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { Ng5SliderModule } from 'ng5-slider';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

// Multiselect
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgxBootstrapSliderModule,
    Ng5SliderModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgxBootstrapSliderModule,
    Ng5SliderModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class SharedModule { }
