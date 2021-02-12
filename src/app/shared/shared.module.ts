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
import { GlobalLoadingComponent } from '../home/components/global-loading/global-loading.component';

@NgModule({
  declarations: [
    GlobalLoadingComponent
  ],
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
    NgxChartsModule,
    GlobalLoadingComponent
  ]
})
export class SharedModule { }
