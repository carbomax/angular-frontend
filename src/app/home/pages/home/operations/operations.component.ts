import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderPage } from '../../../../models/meli-orders/orders-page.model';
import { NgbCalendar, NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MeliOrdersService } from '../../../services/meli-orders.service';
import { MeliOrders, Carrier } from '../../../../models/meli-orders/meli-orders.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

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
  loading = false;
  loadingSearch = false;
  loadingClear = false;
  emptySearch = false;
  errorOrders = false;
  orderStatusClear = '';
  orderStatusSearch = '';
  clientNameSearch = '';
  orderStatus = [];

  carrier = 1;

  styleCarries = `background-color: #858796; color: white`;
  styleTag = '';

  constructor(public meliOrderService: MeliOrdersService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.loadOrders();
  }


  searchOrders(): void {

    console.log(this.modelFrom)
    console.log(this.validateDates())
    if (this.validateDates()) {
      this.loadingSearch = true;
      this.orderStatus = [];
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
    this.loading = true;
    this.buildDateFilter();
    this.meliOrderService.getAllOrdersByProfile(this.page - 1, this.size, this.orderStatus, this.clientNameSearch, this.dateFrom, this.dateTo).subscribe((resp: OrderPage) => {
      if (this.loadingSearch && resp.totalElements === 0) {
        this.emptySearch = true;
      } else { this.emptySearch = false; }
      this.orderPage = resp;
      this.loadingClear = false;
      this.loadingSearch = false;
      this.errorOrders = false;
      this.loading = false;
    }, (error: any) => {
      this.errorOrders = true;
      this.loadingClear = false;
      this.loadingSearch = false;
      this.emptySearch = false;
      this.loading = false;
    });
  }

  changeTag(order: MeliOrders): void {
    console.log(order)
  }


  changeCarrier(order: MeliOrders): void {
    console.log(order)
    this.loading = true;
    this.meliOrderService.updateCarrier(order.id, order.carrier.id)
      .subscribe(resp => { console.log(resp); this.loading = false; },
        error => {
          this.loadOrders();
          Swal.fire({
            icon: 'error',
            title: 'Malas noticias',
            text: 'No se pudo cambiar el carrier de la órden!',
            position: 'top-end'
          });
        });
  }


  updateInvoice(order: MeliOrders): void {
    console.log(order)
    this.loading = true;
    this.meliOrderService.updateInvoice(order.id, order.invoiceNumberBss)
      .subscribe(resp => { console.log(resp); this.loading = false; },
        error => {
          this.loadOrders();
          Swal.fire({
            icon: 'error',
            title: 'Malas noticias',
            text: 'No se pudo actualizar el número de factura de la órden!',
            position: 'top-end'
          });
        });
  }


  updateDescription(order: MeliOrders): void {
    console.log(order)
    this.loading = true;
    this.meliOrderService.updateDescription(order.id, order.descriptionBss)
      .subscribe(resp => { console.log(resp); this.loading = false; },
        error => {
          this.loadOrders();
          Swal.fire({
            icon: 'error',
            title: 'Malas noticias',
            text: 'No se pudo actualizar la descripción de la órden!',
            position: 'top-end'
          });
        });
  }


  updateObservation(order: MeliOrders): void {
    console.log(order)
    this.loading = true;
    this.meliOrderService.updateObservation(order.id, order.observationBss)
      .subscribe(resp => { console.log(resp); this.loading = false; },
        error => {
          this.loadOrders();
          Swal.fire({
            icon: 'error',
            title: 'Malas noticias',
            text: 'No se pudo actualizar la observación de la órden!',
            position: 'top-end'
          });
        });
  }

  private buildDateFilter(): void {
    if (this.modelFrom) {

      this.dateFrom = +`${this.modelFrom.year}${this.modelFrom.month}${this.modelFrom.day}`;
    } else { this.dateFrom = null; }

    if (this.modelTo) {

      this.dateTo = +`${this.modelTo.year}${this.modelTo.month}${this.modelTo.day}`;
    } else { this.dateTo = null; }

  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getCarrierStyleInitial(value): string {
    let initialStyle = '';
    switch (value) {

      case 0:
        initialStyle = `background-color: gray; color: white`;
        break;
      case 1:
        initialStyle = `background-color: #fd7e14; color: white`;
        break;
      case 2:
        initialStyle = `background-color: #e74a3b; color: white`;
        break;
      case 3:
        initialStyle = `background-color: blue; color: white`;
        break;
      case 4:
        initialStyle = `background-color: #36b9cc; color: white`;
        break;
      case 5:
        initialStyle = `background-color:  #1cc88a; color: white`;
        break;
      case 6:
        initialStyle = `background-color:  #e83e8c; color: white`;
        break;
      default:
        initialStyle = `background-color: gray; color: white`;
        break;
    }

    return initialStyle;
  }
  getCarrierStyle(id, value: number): void {

    switch (value) {

      case 0:
        this.styleCarries = `background-color: gray; color: white`;
        break;
      case 1:
        this.styleCarries = `background-color: #fd7e14; color: white`;
        break;
      case 2:
        this.styleCarries = `background-color: #e74a3b; color: white`;
        break;
      case 3:
        this.styleCarries = `background-color: blue; color: white`;
        break;
      case 4:
        this.styleCarries = `background-color: #36b9cc; color: white`;
        break;
      case 5:
        this.styleCarries = `background-color:  #1cc88a; color: white`;
        break;
      case 6:
        this.styleCarries = `background-color:  #e83e8c; color: white`;
        break;
      default:
        this.styleCarries = `background-color:  gray; color: white`;
        break;
    }
    document.getElementById(`${id}`).setAttribute('style', this.styleCarries);

  }



  getCarrierStyleInitialTag(value): string {
    let style = '';
    switch (value) {
      case 0:
        style = `background-color: #e74a3b;  color: white`;
        break;
      case 1:
        style = `background-color: #1cc88a; color: white`;
        break;
      default:
        style = `background-color: #e74a3b; color: white`;
        break;
    }

    return style;
  }
  getCarrierStyleTag(id, value): void {

    switch (value) {

      case 0:
        this.styleTag = `background-color: #e74a3b; color: white`;
        break;
      case 1:
        this.styleTag = `background-color: #1cc88a; color: white`;
        break;
      default:
        this.styleTag = `background-color:  #e74a3b; color: white`;
        break;
    }
    document.getElementById(`${id}`).setAttribute('style', this.styleTag)
  }
}
