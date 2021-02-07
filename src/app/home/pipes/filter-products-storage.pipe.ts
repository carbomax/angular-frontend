import { Pipe, PipeTransform } from '@angular/core';
import { ProductStore } from '../../models/product.store';

@Pipe({
  name: 'filterProductsStorage'
})
export class FilterProductsStoragePipe implements PipeTransform {

  transform(value: ProductStore[], searchNotExistMarketplace: boolean, searchExistMeliMarketplace: boolean): ProductStore[] {

    let products: ProductStore[] = [];

   if(!searchExistMeliMarketplace && !searchNotExistMarketplace){
     return value;
   }

   if(searchExistMeliMarketplace && searchNotExistMarketplace){
    return value;
  }
   // Search exist in Meli Marketplace
   if(searchExistMeliMarketplace) {
    value.forEach( product => {
      if( product.existInMeliStore){
        products.push(product);
      }
    })
   } 

    // Search exist in Meli Marketplace
    if(searchNotExistMarketplace) {
      value.forEach( product => {
        if(!product.existInMeliStore){
          products.push(product);
        }
      })
     } 

    console.log('product', products);

    return products;
  }

}
