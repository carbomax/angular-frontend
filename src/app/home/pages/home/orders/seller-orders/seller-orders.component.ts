import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MeliOrdersService } from '../../../../services/meli-orders.service';
import { OrdersStatusEnum } from '../../../../../enums/orders.status.enum';
import { OrderPage } from '../../../../../models/meli-orders/orders-page.model';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

  orderPage = new OrderPage();
  page = 1;
  size = 1;

  hoveredDate: NgbDate | null = null;

  modelFrom: NgbDateStruct;
  modelTo: NgbDateStruct;
  today = this.calendar.getToday();

  orderStatusClear = '';
  orderStatusSearch = '';

  constructor(public meliOrderService: MeliOrdersService,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
   this.loadOrders();
  }


  selectChangeHandler(size): void {
    this.size = +size;
    this.loadOrders();
  }

  loadProductsPaginator(page): void{
   this.page = page;
   this.loadOrders();
  }

  loadOrders(): void {
    this.meliOrderService.getAllOrdersByProfile(this.page - 1, this.size, []).subscribe( (resp: OrderPage) => {
      this.orderPage = resp;
    });
  }



}
