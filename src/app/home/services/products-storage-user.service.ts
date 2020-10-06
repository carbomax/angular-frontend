import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SelectedProducResponse } from '../../models/selected.products.response';
import { MarketplaceDetails } from '../../models/marketplace.details';

@Injectable({
  providedIn: 'root'
})
export class ProductsStorageUserService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_ACTIONS = '/products/api'; 

  constructor(private http: HttpClient) { }

  storeMyProducts( marketplace: Number, products: any[]): Observable<SelectedProducResponse>{
    //obtener el usuario autenticado
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/select-myproducts/?idProfile=${1}&marketplace=${marketplace}
    &products=${products}`;

    return this.http.get<SelectedProducResponse>(params);
  }

  getDetailsMarketplaces(): Observable<MarketplaceDetails[]>{
    //obtener el usuario autenticado
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/marketplaces-details/${1}`;
    return this.http.get<MarketplaceDetails[]>(params);
  }

}
