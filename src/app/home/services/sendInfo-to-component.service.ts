import { Injectable } from '@angular/core';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';

@Injectable({
  providedIn: 'root'
})
export class SendInfoToComponentService {

  productPublishedSelectedList: ProductMeliPublished[] = [];
  countElementsOfList: number;

constructor() { }

/** Methods to send info to breadcrumbs component **/
setInfoOfProductPublishedSelectedView(productsSelected: ProductMeliPublished[]): void {
  this.productPublishedSelectedList = productsSelected;
}

setCountOfProductPublishedView(count: number): void {
  this.countElementsOfList = count;
}

}
