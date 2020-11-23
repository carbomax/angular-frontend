import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MeliOrdersService } from '../../../../services/meli-orders.service';
import { OrderPage } from '../../../../../models/meli-orders/orders-page.model';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

  @ViewChild('dateFrom') dateFromCalendar: ElementRef;
  @ViewChild('dateTo') dateToCalendar: ElementRef;

  orderPage = new OrderPage();
  page = 1;
  size = 5;

  hoveredDate: NgbDate | null = null;

  modelFrom: NgbDateStruct = { year: 0, month: 0, day: 0};
  modelTo: NgbDateStruct = { year: 0, month: 0, day: 0};
  errorDateFrom = false;
  errorDateTo = false;
  today = this.calendar.getToday();
  dateFrom = 0;
  dateTo = 99999999;


  // Search
  loading = false;
  loadingSearch = false;
  loadingClear = false;
  emptySearch = false;
  errorOrders = false;
  orderStatusClear = '';
  orderStatusSearch = '';
  clientNameSearch = '';
  orderStatus = [];

  constructor(public meliOrderService: MeliOrdersService,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadOrders();
  }


  searchOrders(): void {
    if (this.validateDates()) {
      this.loadingSearch = true;
      this.orderStatus = [];
      this.orderStatusSearch !== '' ? this.orderStatus.push(this.orderStatusSearch) : this.orderStatus = [];
      this.loadOrders();
    }

  }

  validateDates(): boolean {

    console.log(this.modelFrom)
    if(this.modelFrom === undefined || this.modelFrom === null || isNaN(this.modelFrom.year)){
      this.errorDateFrom = true;
    } else {
      this.dateFrom = 0;
      this.errorDateFrom = false;
    }

    if(this.modelTo === undefined || this.modelTo === null || isNaN(this.modelTo.year)){
      this.errorDateTo = true;
    } else {
      this.dateTo = 99999999;
      this.errorDateTo = false;
    }

    return !this.errorDateFrom && !this.errorDateTo;
  }

  clearOrders(): void {
    this.errorDateFrom = false;
    this.errorDateTo = false;
    this.loadingClear = true;
    this.orderStatus = [];
    this.orderStatusClear = '';
    this.orderStatusSearch = '';
    this.clientNameSearch = '';
    this.modelFrom = { year: 0 , month: 0, day: 0};
    this.modelTo = { year: 0 , month: 0, day: 0};
    this.dateFrom = 0;
    this.dateTo = 99999999;
    this.loadOrders();
  }

  selectChangeHandler(size): void {
    this.loading = true;
    this.size = +size;
    console.log('size', this.size)
    this.loadOrders();
  }

  loadProductsPaginator(page): void {
    this.loading = true;
    this.page = page;
    this.loadOrders();
  }

  loadOrders(): void {
    this.buildDateFilter();
    console.log(this.dateFrom)
    console.log(this.dateTo)
    this.meliOrderService.getAllOrdersByProfile(this.page - 1, this.size, this.orderStatus, this.clientNameSearch, this.dateFrom, this.dateTo).subscribe((resp: OrderPage) => {
      if (this.loadingSearch && resp.totalElements === 0) {
        this.emptySearch = true;
      } else { this.emptySearch = false; }
      this.loading = false;
      this.orderPage = resp;
      this.loadingClear = false;
      this.loadingSearch = false;
      this.errorOrders = false;
    }, (error: any) => {
      this.errorOrders = true;
      this.loadingClear = false;
      this.loadingSearch = false;
      this.emptySearch = false;
      this.loading = false;
    });
  }

  private buildDateFilter(): void {
    if (this.modelFrom.year !== 0 ) {

      this.dateFrom = +`${this.modelFrom.year}${this.modelFrom.month}${this.modelFrom.day}`;
    } else { this.dateFrom = 0}

    if (this.modelTo.year !== 0) {

      this.dateTo = +`${this.modelTo.year}${this.modelTo.month}${this.modelTo.day}`;
    } else { this.dateTo = 99999999 }

  }

}
