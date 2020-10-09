import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectedProducResponse } from '../../models/selected.products.response';
import { MarketplaceDetails } from '../../models/marketplace.details';
import { PageProductMeliStorage } from '../../models/page.myproduct.custom.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsStorageUserService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_ACTIONS = '/products/api'; 

  pageProductsMeli: PageProductMeliStorage;

  constructor(private http: HttpClient) { 
    this.pageProductsMeli = new PageProductMeliStorage();
  }

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

  getPageMyCustomProducts(page: number, size: number, sku: string, nameProduct: string,
    state: number, familyId: number, minPrice: number, maxPrice: number): Observable<PageProductMeliStorage> {

    const uri = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/items-meli-filters/${page}/${size}
    ?sku=${sku}&nameProduct=${nameProduct}&state=${state}&familyId=${familyId}
    &minPrice=${minPrice}&maxPrice=${maxPrice}`;
  
    return this.http.get<PageProductMeliStorage>(uri).pipe(map((resp: any) => {
      this.pageProductsMeli.itemsMeliGrid = resp.itemsMeliGridList;
      this.pageProductsMeli.totalElements = resp.totalElements;      
      this.pageProductsMeli.size = resp.size;
      this.pageProductsMeli.totalPages = resp.totalPages;
      this.pageProductsMeli.last = resp.last;
      this.pageProductsMeli.first = resp.first;
      this.pageProductsMeli.sort = resp.sort;
      this.pageProductsMeli.totalProducts = resp.totalProducts;
      return this.pageProductsMeli;
    }));
  }

}
