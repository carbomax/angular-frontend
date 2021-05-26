
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {

  URI_MELI_REPORS = `${environment.URI_ROOT}/meli/api/reports`;
  profileId: number

constructor(private http: HttpClient, private authService: AuthService) { }

exportProductsPublished(productsSelectedList: ProductMeliPublished[]) {

  if(productsSelectedList.length > 0) {
    const ids =  productsSelectedList.map( p => p?.id);
    return this.http.post(`${this.URI_MELI_REPORS}/download-publications?profileId=${this.profileId = 0}`, ids, { responseType: 'blob'});
  }
  else {
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    return this.http.post(`${this.URI_MELI_REPORS}/download-publications?profileId=${this.profileId}`, [], { responseType: 'blob'});

  }

}

}
