import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pagination
import { NgxPaginationModule } from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Multiselect
import { NgSelectModule } from '@ng-select/ng-select';

// Charts
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    NgSelectModule,
    NgxChartsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxChartsModule
  ]
})
export class SharedModule { }
