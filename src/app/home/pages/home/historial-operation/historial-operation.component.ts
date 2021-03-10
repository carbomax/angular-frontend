import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MeliOrders } from '../../../../models/meli-orders/meli-orders.model';
import Swal from 'sweetalert2';
import { OrderPage } from '../../../../models/meli-orders/orders-page.model';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MeliOrdersOperationService } from '../../../services/meli-orders.-operation.service';
import { FormControl } from '@angular/forms';
import { DateTimeMomentService } from 'src/app/core/services/date-time-moment.service';

@Component({
  selector: 'app-historial-operation',
  templateUrl: './historial-operation.component.html',
  styleUrls: ['./historial-operation.component.css']
})
export class HistorialOperationComponent implements OnInit {

  @ViewChild('dateFrom') dateFromCalendar: ElementRef;
  @ViewChild('dateTo') dateToCalendar: ElementRef;
  public dateFromControl: FormControl = new FormControl(null);
  public dateToControl: FormControl = new FormControl(null);
  orderPage = new OrderPage();
  page = 1;
  size = 15;

  hoveredDate: NgbDate | null = null;

  modelFrom: NgbDateStruct = { year: 0, month: 0, day: 0 };
  modelTo: NgbDateStruct = { year: 0, month: 0, day: 0 };
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
  operatorBusinesStatus: string [] = ['delivered'];

  carrier = 1;

  styleCarries = `background-color: #858796; color: white`;
  styleTag = '';
  styleOperatorBssStyle = `background-color: #36b9cc; color: white`;

  constructor(
    private dateTimeService: DateTimeMomentService,
    public meliOperationOrderService: MeliOrdersOperationService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadOrders();
  }


  searchOrders(): void {

      this.loadingSearch = true;
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
    this.loadOrders();
  }

  loadProductsPaginator(page): void {
    this.loading = true;
    this.page = +page;
    this.loadOrders();
  }

  loadOrders(): void {
    this.buildDateFilter();
    this.meliOperationOrderService.getAllOrdersByProfile(this.page - 1, this.size, this.orderStatus,'', this.clientNameSearch, this.dateFrom, this.dateTo, this.operatorBusinesStatus).subscribe((resp: OrderPage) => {
      console.log(resp)
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
    if (order.tagBss) {
      this.loading = true;
      this.meliOperationOrderService.updateTagBss(order.id, order.tagBss)
        .subscribe(resp => { console.log(resp); this.loading = false; },
          error => {
            this.loadOrders();
            Swal.fire({
              icon: 'error',
              title: 'Malas noticias',
              text: 'No se pudo realizar la acción!',
              position: 'top-end'
            });
          });
    }
  }


  changeCarrier(order: MeliOrders, value): void {
    this.loading = true;
    this.meliOperationOrderService.updateCarrier(order.id, order.carrier.id)
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
    this.loading = true;
    this.meliOperationOrderService.updateInvoice(order.id, order.invoiceNumberBss)
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

  updateOperatorBusinessStatus(order: MeliOrders): void {
    this.loading = true;
    this.meliOperationOrderService.updateOperatorBusinessStatus(order.id, order.operatorBusinessStatus)
      .subscribe(resp => {
        console.log(resp);
        this.loadOrders();
      },
        error => {
          this.loadOrders();
          Swal.fire({
            icon: 'error',
            title: 'Malas noticias',
            text: 'No se pudo actualizar el estado de la órden!',
            position: 'top-end'
          });
        });
  }

  updateObservation(order: MeliOrders): void {
    if (order.observationBss.trim()) {
      this.loading = true;
      this.meliOperationOrderService.updateObservation(order.id, order.observationBss)
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
    } else {
      this.loadOrders();
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'No puede introducir una observación vacía!',
        position: 'top-end'
      });
    }

  }


  updateOperatorName(order: MeliOrders): void {
    if (order.operatorNameBss.trim()) {
      this.loading = true;
      this.meliOperationOrderService.updateOperatorName(order.id, order.operatorNameBss)
        .subscribe(resp => { console.log(resp); this.loading = false; },
          error => {
            this.loadOrders();
            Swal.fire({
              icon: 'error',
              title: 'Malas noticias',
              text: 'No se pudo actualizar el nombre del operador de la órden!',
              position: 'top-end'
            });
          });
    } else {
      this.loadOrders();
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'No puede introducir un nombre vacío!',
        position: 'top-end'
      });
    }
  }

  getInvoice(order: MeliOrders): void {
    console.log('shippindId', order.shippingId)
    const notificationError = () => Swal.fire({
      icon: 'error',
      title: 'Etiqueta',
      text: 'La etiqueta de esta órden no está disponible en estos momentos!',
      position: 'top-end'
    });
    if (order.shippingId > 0) {
      this.meliOperationOrderService.getInvoice(order)
        .subscribe((url: any) => {

          console.log(url.response)
          if (url.response) {
            window.open(url.response, '_black');
          } else {
            notificationError();
          }
        }, error => {
          console.log(error)
          notificationError();
        });
    } else {
      notificationError();
    }

  }

  private buildDateFilter(): void {
    if (this.dateFromControl.value !== null) {
      this.dateFrom = +`${this.dateFromControl.value.year}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateFromControl.value.month)}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateFromControl.value.day)}`;
    } else { this.dateFrom = 0 }

    if (this.dateToControl.value !== null) {
      this.dateTo = +`${this.dateToControl.value.year}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateToControl.value.month)}${this.dateTimeService.helperZeroBeforeMonthOrDay(this.dateToControl.value.day)}`;
    } else { this.dateTo = 99999999 }

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getOperatorBssToOrderStyleInitial(value): string {
    let initialStyle = '';
    switch (+value) {

      case 0:
        initialStyle = `background-color: #36b9cc; color: white`;
        break;
      case 1:
        initialStyle = `background-color: #e74a3b;  color: white`;
        break;
      case 2:
        initialStyle = `background-color: #1cc88a; color: white`;
        break;
      default:
        initialStyle = `background-color: #36b9cc; color: white`;
        break;
    }

    return initialStyle;
  }
  getOperatorBssToOrderStyle(id, value): void {

    switch (+value) {

      case 0:
        this.styleOperatorBssStyle = `background-color: #36b9cc; color: white`;
        break;
      case 1:
        this.styleOperatorBssStyle = `background-color: #e74a3b;  color: white`;
        break;
      case 2:
        this.styleOperatorBssStyle = `background-color: #1cc88a; color: white`;
        break;
      default:
        this.styleOperatorBssStyle = `background-color: #36b9cc; color: white`;
        break;
    }
    document.getElementById(`${id}`).setAttribute('style', this.styleOperatorBssStyle);

  }

  getCarrierStyleInitial(value): string {
    let initialStyle = '';
    switch (+value) {

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
  getCarrierStyle(id, value): void {

    switch (+value) {

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
    switch (+value) {
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

    switch (+value) {

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
