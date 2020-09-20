import { Pipe, PipeTransform } from '@angular/core';
import { ProductStore } from '../../models/product.store';

@Pipe({
  name: 'filterProductsStorage'
})
export class FilterProductsStoragePipe implements PipeTransform {

  transform(value: ProductStore[], searchName: string, searchSKU: string): ProductStore[] {

    const products: ProductStore[] = [];

    if (searchName === '' && searchSKU === '') {
      return value;
    }

    console.log('searchName', searchName);
    console.log('searchSKU', searchSKU);
    console.log('value', value);
    console.log('evaluando', value[0].sku.toLowerCase().indexOf(searchSKU.toLowerCase()))

    for (const product of value) {
      if (product.name.toLowerCase().indexOf(searchName.toLowerCase()) > -1 &&
      product.sku.toLowerCase().indexOf(searchSKU.toLowerCase()) > -1) {
        products.push(product);
      }

    }
    console.log('product', products);

    return products;
  }

}
