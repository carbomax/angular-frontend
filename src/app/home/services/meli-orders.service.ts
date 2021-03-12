import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Services
import { AuthService } from '../../core/services/auth.service';
import { MeliAccount } from '../../models/meli.account';
import { Observable } from 'rxjs';
import { OrderPage } from '../../models/meli-orders/orders-page.model';



@Injectable({
  providedIn: 'root'
})
export class MeliOrdersService {


  URI_MELI_BUSINESS = `${environment.URI_ROOT}/meli/api/orders`;
  URI_MELI_API = `${environment.URI_ROOT}/meli/api/auth`;
  URI_CONSUMING_ORDERS = `${environment.URI_ROOT}/consuming/api/purchase`;
  profileId: number;



  constructor(private http: HttpClient, private authService: AuthService) { }

  public getAllOrdersByProfile(page: number, size: number, statusFilter: string[], nameClient: string, nameSeller: string, dateFrom, dateTo,
    operatorBusinesStatus: string[]): Observable<OrderPage> {
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    if (statusFilter.length <= 0) {
      statusFilter = ['paid', 'cancelled'];
    }
    if(operatorBusinesStatus.length <= 0){
      operatorBusinesStatus = ['in_process', 'undelivered', 'delivered']
    }
    if (dateFrom == null) {
      dateFrom = 0;
    }
    if (dateTo == null) {
      dateTo = 99999999;
    }


    const url = `${this.URI_MELI_BUSINESS}/by-all-profile-accounts/${this.profileId}?page=${page}&size=${size}&statusFilter=${statusFilter}&nameClient=${nameClient}&nameSeller=${nameSeller}&dateFrom=${dateFrom}&dateTo=${dateTo}&operatorBusinessStatus=${operatorBusinesStatus}`
    console.log(url)
    return this.http.get<OrderPage>(url);
  }

  updateCarrier(orderId: number, carrierId: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-carrier/${orderId}/${carrierId}`,{});
  }

  updateInvoice(orderId: number, invoice: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-invoice/${orderId}?invoice=${invoice}`,{});
  }

  updateDescription(orderId: number, description: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-description/${orderId}?description=${description}`,{});
  }

  updateObservation(orderId: number, observation: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.URI_MELI_BUSINESS}/update-observation/${orderId}?observation=${observation}`,{});
  }

  public processPurchases(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.URI_CONSUMING_ORDERS}/process/${orderId}`);
  }

}
