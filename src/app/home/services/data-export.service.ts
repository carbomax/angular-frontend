import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Console } from 'console';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {

  URI = environment.URI_ROOT;

constructor(private http: HttpClient, private authService: AuthService) { }

exportProductsPublished(productsSelectedList: ProductMeliPublished[]): void {
  let profileId = this.authService.authenticationDataExtrac().profileId;
  if(productsSelectedList.length > 0) {
    /*llamada al servicio exportar seleccionados*/
    console.log("llamada al servicio exportar seleccionados.");
  }
  else {
    /*llamada al servicio exportar todos*/
    console.log("llamada al servicio exportar todos.");
  }

}

}
