import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ProductsMeliPublishedService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_PUBLISHED_SERVICE = `${this.URI}/products/api/published`;
  URI_UPLOAD_ACTIONS = '/upload/api';

  constructor(private http: HttpClient) {
  }


  public getProductsPublished(page: number, size: number){
    return this.http.get(`${this.URI_PRODUCTS_PUBLISHED_SERVICE}/15?page=${page}&size=${size}`);
  }

}
