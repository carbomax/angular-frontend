import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MeliOrdersService } from '../../../../services/meli-orders.service';
import { OrderPage } from '../../../../../models/meli-orders/orders-page.model';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { MeliOrders } from '../../../../../models/meli-orders/meli-orders.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { DateTimeMomentService } from 'src/app/core/services/date-time-moment.service';
import Swal from 'sweetalert2';
import { RoleEnum } from 'src/app/enums/role.enum';




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
  size = 15;

  errorDateFrom = false;
  errorDateTo = false;
  today = this.calendar.getToday();
  dateFrom = 0;
  dateTo = 99999999;

  //To ERP  status
  itemSent: number;
  itemProcess: number;

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
              public formatter: NgbDateParserFormatter,
              private dateTimeService: DateTimeMomentService,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.loadOrders();
    this.itemSent = -1;
    this.itemProcess = -1;
  }

  public isAdmin(): boolean {
    return this.authService.authenticationDataExtrac()?.roles.includes(RoleEnum.ADMIN);
  }

  getTotal(item: MeliOrders): number{

    let totalAmount = 0;
    let amountTaxes = 0;
    let baseCost = 0;

    if(item){
       totalAmount = item.totalAmount;
       amountTaxes = item.amountTaxes;
       if(item.shipment){
         baseCost = item.shipment.baseCost;
       }
    }

    return totalAmount + amountTaxes + baseCost;

  }
  orderByDesc(i, orderPage: OrderPage): number{
    return orderPage.totalElements - i;
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
    this.page = +page;
    this.loadOrders();
  }

  loadOrders(): void {
    this.buildDateFilter();
    this.meliOrderService.getAllOrdersByProfile(this.page - 1, this.size, this.orderStatus, this.clientNameSearch,'', this.dateFrom, this.dateTo, []).subscribe((resp: OrderPage) => {
      console.log(resp)
      if (this.loadingSearch && resp.totalElements === 0) {
        this.emptySearch = true;
      } else { this.emptySearch = false; }
      this.itemSent = -1;
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

  processPurchases(order: MeliOrders): void {
    this.itemProcess = order.id;
    this.meliOrderService.processPurchases(order.id).subscribe(resp => {
      this.itemSent = order.id;
      this.itemProcess = -1;
      this.loadOrders();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Orden ${order.orderId} enviado correctamente`,
        showConfirmButton: false,
        timer: 5000
      })
    },
    error => {
      //Tratando el obj error, podria mostrar el mensaje o causa del error
      this.itemProcess = -1;
      this.loadOrders();
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Envío de Orden ${order.orderId} al ERP fallido`,
        showConfirmButton: false,
        timer: 5000
      })
    })
  }

  private buildDateFilter(): void {

    if (this.dateFromControl.value !== null) {
      this.dateFrom = +`${this.dateFromControl.value.year}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateFromControl.value.month)}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateFromControl.value.day)}`;
    } else { this.dateFrom = 0 }

    if (this.dateToControl.value !== null) {
      this.dateTo = +`${this.dateToControl.value.year}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateToControl.value.month)}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateToControl.value.day)}`;
    } else { this.dateTo = 99999999 }

  }

}
