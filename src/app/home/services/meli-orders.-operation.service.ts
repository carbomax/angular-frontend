import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


// Services
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { OrderPage } from '../../models/meli-orders/orders-page.model';
import { MeliOrders } from '../../models/meli-orders/meli-orders.model';



@Injectable({
  providedIn: 'root'
})
export class MeliOrdersOperationService {


  URI_MELI_BUSINESS = `${environment.URI_ROOT}/meli/api/orders`;
  URI_MELI_API = `${environment.URI_ROOT}/meli/api/auth`;
  profileId: number;



  constructor(private http: HttpClient, private authService: AuthService) { }

  public getAllOrdersByProfile(page: number, size: number, statusFilter: string[], nameClient: string, dateFrom, dateTo): Observable<OrderPage> {
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    if (statusFilter.length <= 0) {
      statusFilter = ['paid', 'cancelled'];
    }
    if (dateFrom == null) {
      dateFrom = 0;
    }
    if (dateTo == null) {
      dateTo = 99999999;
    }


    const url = `${this.URI_MELI_BUSINESS}/by-all-profile-accounts/${this.profileId}?page=${page}&size=${size}&&statusFilter=${statusFilter}&nameClient=${nameClient}&dateFrom=${dateFrom}&dateTo=${dateTo}`
    console.log(url)
    return this.http.get<OrderPage>(url);
  }


  updateTagBss(orderId: number, tagBss: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-tag/${orderId}?tagBss=${tagBss}`, {});
  }

  updateCarrier(orderId: number, carrierId: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-carrier/${orderId}/${carrierId}`, {});
  }

  updateInvoice(orderId: number, invoice: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-invoice/${orderId}?invoice=${invoice}`, {});
  }

  updateOperatorName(orderId: number, name: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-operator-name/${orderId}?name=${name}`, {});
  }


  updateObservation(orderId: number, observation: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-observation/${orderId}?observation=${observation}`, {});
  }

  getInvoice(order: MeliOrders): Observable<any> {
    return this.http.get<any>(`${this.URI_MELI_BUSINESS}/url-invoice/${order.id}`);
  }


}
