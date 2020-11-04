import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { PageProductMeliPublished } from '../../models/meli-publication/product-meli-published.model';




@Injectable({
  providedIn: 'root'
})
export class ProductsMeliPublishedService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_PUBLISHED_SERVICE = `${this.URI}/products/api/published`;
  URI_UPLOAD_ACTIONS = '/upload/api';
  profileId: number;
  constructor(private http: HttpClient, private authService: AuthService) {
  }


  public getProductsPublished(page: number, size: number): Observable<PageProductMeliPublished>{
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    return this.http.get<PageProductMeliPublished>(`${this.URI_PRODUCTS_PUBLISHED_SERVICE}/${this.profileId}?page=${page}&size=${size}`);
  }

}
