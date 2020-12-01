import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MeliOrdersService } from '../../../../services/meli-orders.service';
import { OrderPage } from '../../../../../models/meli-orders/orders-page.model';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';




@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

  @ViewChild('dateFrom') dateFromCalendar: ElementRef;
  @ViewChild('dateTo') dateToCalendar: ElementRef;
  public dateFromControl: FormControl = new FormControl(null);
  public dateToControl: FormControl = new FormControl(null);
  orderPage = new OrderPage();
  page = 1;
  size = 5;

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
              public formatter: NgbDateParserFormatter) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.loadOrders();
  }

  orderByDesc(i, size): number{
    return size - i;
  }

  searchOrders(): void {

    this.loadingSearch = true;
    this.errorDateFrom = false;
    this.errorDateTo = false;
    this.orderStatus = [];
    this.orderStatusSearch !== '' ? this.orderStatus.push(this.orderStatusSearch) : this.orderStatus = [];
    this.loadOrders();


  }

  onDateFromSelection(date: NgbDate): void {

    if (!this.dateToControl.value) {
      this.dateToControl.setValue({ year: date.year, month: date.month, day: date.day });
    }
  }

  onDateToSelection(date: NgbDate): void {
    if (!this.dateFromControl.value) {
      this.dateFromControl.setValue({ year: date.year, month: date.month, day: date.day });
    }
  }

  clearOrders(): void {
    this.errorDateFrom = false;
    this.errorDateTo = false;
    this.loadingClear = true;
    this.orderStatus = [];
    this.orderStatusClear = '';
    this.orderStatusSearch = '';
    this.clientNameSearch = '';
    this.dateFromControl.setValue(null);
    this.dateToControl.setValue(null);
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
    this.meliOrderService.getAllOrdersByProfile(this.page - 1, this.size, this.orderStatus, this.clientNameSearch, this.dateFrom, this.dateTo, []).subscribe((resp: OrderPage) => {
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

    if (this.dateFromControl.value !== null) {
      this.dateFrom = +`${this.dateFromControl.value.year}${this.dateFromControl.value.month}${this.dateFromControl.value.day}`;
    } else { this.dateFrom = 0 }

    if (this.dateToControl.value !== null) {

      this.dateTo = +`${this.dateToControl.value.year}${this.dateToControl.value.month}${this.dateToControl.value.day}`;
    } else { this.dateTo = 99999999 }

  }


}
