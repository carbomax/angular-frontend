import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { PageProductMeliPublished, ProductMeliPublished } from '../../models/meli-publication/product-meli-published.model';
import { ChangeMultipleStatusRequest } from '../../models/meli-publication/change.multiple.status.request';



@Injectable({
  providedIn: 'root'
})
export class ProductsMeliPublishedService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_PUBLISHED_SERVICE = `${this.URI}/products/api/published`;
  URI_MELI_SERVICE =  `${this.URI}/meli/api/accounts`;
  URI_UPLOAD_ACTIONS = '/upload/api';
  profileId: number;
  constructor(private http: HttpClient, private authService: AuthService) {
  }


  public getProductsPublished(page: number, size: number, skuSearch: string, idMeliSearch: string, meliAccountSearch: number,
      typeStateSearch: string): Observable<PageProductMeliPublished>{
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    return this.http.get<PageProductMeliPublished>(`${this.URI_PRODUCTS_PUBLISHED_SERVICE}/${this.profileId}?page=${page}&size=${size}&sku=${skuSearch}
          &idMeliPublication=${idMeliSearch}&meliAccount=${meliAccountSearch}&typeStateSearch=${typeStateSearch}`);
  }

  updateProductsPublished(product: ProductMeliPublished, imageToDelete: number[]): Observable<ProductMeliPublished>{
    const params = `${this.URI_PRODUCTS_PUBLISHED_SERVICE}/edit-publication-info/?imagesToDelete=${imageToDelete}`;
    return this.http.put<ProductMeliPublished>(params, product);
  }

  public changeStatusPublication(accountId: number, status: number, publicationId: string) {
    return this.http.post(`${this.URI_MELI_SERVICE}/changeStatusPublication/${accountId}/${publicationId}?status=${status}` , {});
  }

  public changeStatusMultiplePublications(products: ProductMeliPublished[], status: number) {    
    let multipleStatusList: ChangeMultipleStatusRequest[] = [];
    products.forEach(product => {    
        let position = multipleStatusList.findIndex(p => p.accountId === product.accountMeli);
        if(position !== -1){
          multipleStatusList[position].publicationsIds.push(product.idPublicationMeli);
        }
        else{ 
          multipleStatusList.push(new ChangeMultipleStatusRequest(product.accountMeli, [product.idPublicationMeli]));
        }      
    })
    return this.http.post(`${this.URI_MELI_SERVICE}/changeStatusMultiplePublications?status=${status}`, multipleStatusList);
  }

  deletePublication(accountId: number, status: string, publicationId: string) {
    return this.http.put(`${this.URI_MELI_SERVICE}/delete-publication/${accountId}/${publicationId}?status=${status}` , {});
  }

  republishPublication(accountId: number, publicationId: string){
    return this.http.post(`${this.URI_MELI_SERVICE}/republish-publication/${accountId}/${publicationId}` , {});
  }

}
