import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SelectedProducResponse } from '../../models/selected.products.response';

@Injectable({
  providedIn: 'root'
})
export class ProductsStorageUserService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_STORE_USER = '/products/api';

  constructor(private http: HttpClient) { }

  storeMyProducts( marketplace: Number, products: any[]): Observable<SelectedProducResponse>{
    //obtener el usuario autenticado
    const params = `${this.URI}${this.URI_PRODUCTS_STORE_USER}/select-myproducts/?idUser=${1}&marketplace=${marketplace}
    &products=${products}`;

    return this.http.get<SelectedProducResponse>(params);
  }

}
