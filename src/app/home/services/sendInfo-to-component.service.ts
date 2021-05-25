import { Injectable } from '@angular/core';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';

@Injectable({
  providedIn: 'root'
})
export class SendInfoToComponentService {

  productPublishedList: ProductMeliPublished[] = [];

constructor() { }

/** Methods to send info to breadcrumbs component **/
setInfoOfProductPublishedView(productsSelected: ProductMeliPublished[]): void {
  this.productPublishedList = productsSelected;
}

}
