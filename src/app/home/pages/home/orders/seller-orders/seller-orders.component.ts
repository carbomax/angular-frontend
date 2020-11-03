import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeliOrdersService } from '../../../../services/meli-orders.service';
import { OrdersStatusEnum } from '../../../../../enums/orders.status.enum';
import { OrderPage } from '../../../../../models/meli-orders/orders-page.model';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { ThrowStmt } from '@angular/compiler';


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

  modelFrom: NgbDateStruct;
  modelTo: NgbDateStruct;
  errorDateFrom = false;
  errorDateTo = false;
  today = this.calendar.getToday();
  dateFrom = null;
  dateTo = null;


  // Search
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
    this.loadOrders();
  }


  searchOrders(): void {

    console.log(this.modelFrom)
    if (this.validateDates()) {
      this.loadingSearch = true;
      this.orderStatusSearch !== '' ? this.orderStatus.push(this.orderStatusSearch) : this.orderStatus = [];
      this.loadOrders();
    }

  }

  validateDates(): boolean {
    if (this.modelFrom !== undefined && !this.modelFrom.year) {
      this.errorDateFrom = true;
    } else { this.errorDateFrom = false; }

    if (this.modelTo !== undefined && !this.modelTo.year) {
      this.errorDateTo = true;
    } else { this.errorDateTo = false; }

    return !this.errorDateFrom && !this.errorDateTo;
  }

  clearOrders(): void {
    this.loadingClear = true;
    this.orderStatus = [];
    this.orderStatusClear = '';
    this.orderStatusSearch = '';
    this.clientNameSearch = '';
    this.modelFrom = null;
    this.modelTo = null;
    this.loadOrders();
  }

  selectChangeHandler(size): void {
    this.size = +size;
    console.log('size', this.size)
    this.loadOrders();
  }

  loadProductsPaginator(page): void {
    this.page = page;
    this.loadOrders();
  }

  loadOrders(): void {
    this.buildDateFilter();
    this.meliOrderService.getAllOrdersByProfile(this.page - 1, this.size, this.orderStatus, this.clientNameSearch, this.dateFrom, this.dateTo).subscribe((resp: OrderPage) => {
      if (this.loadingSearch && resp.totalElements === 0) {
        this.emptySearch = true;
      } else { this.emptySearch = false; }
      this.orderPage = resp;
      this.loadingClear = false;
      this.loadingSearch = false;
      this.errorOrders = false;
    }, (error: any) => {
      this.errorOrders = true;
      this.loadingClear = false;
      this.loadingSearch = false;
      this.emptySearch = false;
    });
  }

  private buildDateFilter(): void{
    if (this.modelFrom) {

      this.dateFrom = +`${this.modelFrom.year}${this.modelFrom.month}${this.modelFrom.day}`;
    } else { this.dateFrom = null; }

    if (this.modelTo) {

      this.dateTo = +`${this.modelTo.year}${this.modelTo.month}${this.modelTo.day}`;
    } else { this.dateTo = null; }

  }

}
