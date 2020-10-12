import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectedProducResponse } from '../../models/selected.products.response';
import { MarketplaceDetails } from '../../models/marketplace.details';
import { PageProductMeliStorage } from '../../models/page.myproduct.custom.model';
import { EditableProductModel } from '../../models/editable.product.model';


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

  storeMyProducts(idProfile: number, marketplace: Number, products: any[]): Observable<SelectedProducResponse>{    
    let string_profile = idProfile.toString();
    let encodeProfile = btoa(string_profile);
    
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/select-myproducts/${encodeProfile}?marketplace=${marketplace}
    &products=${products}`;

    return this.http.get<SelectedProducResponse>(params);     
  }

  getDetailsMarketplaces(idProfile: number): Observable<MarketplaceDetails[]>{     
    let string_profile = idProfile.toString();
    let encodeProfile = btoa(string_profile);

    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/marketplaces-details/${encodeProfile}`;
    return this.http.get<MarketplaceDetails[]>(params);   
  }

  getPageMyCustomProducts(idProfile: number, page: number, size: number, sku: string, nameProduct: string,
    state: number, familyId: number, minPrice: number, maxPrice: number): Observable<PageProductMeliStorage> {
    
      let string_profile = idProfile.toString();
      let encodeProfile = btoa(string_profile);

    const uri = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/items-meli-filters/${page}/${size}/${encodeProfile}
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

  getCustomProduct(id: number): Observable<EditableProductModel>{
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/product-info/${id}`;
    return this.http.get<EditableProductModel>(params);
  }

  updateCustomProduct(product: EditableProductModel, imageToDelete: number[]): Observable<EditableProductModel>{
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/edit-product-info/?imagesToDelete=${imageToDelete}`;
    return this.http.put<EditableProductModel>(params, product);
  }

}
