import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageProductStorage } from '../../models/page.product.store';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsStorageService {

  URI = environment.URI_ROOT;
  URI_SERVICE = '/consumer/ws/api/items-by-filters';
  constructor(private http: HttpClient) { }

  getPageProducts(page: number, size: number, sku: string, nameProduct: string, categoryNameDescription: string, price: number) {

    const uri = `${this.URI}${this.URI_SERVICE}/${page}/${size}
    ?sku=${sku}&nameProduct=${nameProduct}&categoryNameDescription=${categoryNameDescription}
    &price=${price}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log(uri)
    this.http.get(uri, httpOptions).subscribe((response: any) => {
        console.log(response)
      })
  }
}
