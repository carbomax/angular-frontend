import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductStore } from '../../../../../models/product.store';
import { PRODUCTS_STORAGE } from './products.json';
import { Options, LabelType } from 'ng5-slider';

import { map } from 'rxjs/operators';
import { ProductsStorageService } from '../../../../services/products-storage.service';

@Component({
  selector: 'app-products-store',
  templateUrl: './products-store.component.html',
  styleUrls: ['./products-store.component.css']
})
export class ProductsStoreComponent implements OnInit {

  nameSeach = '';
  skuSearch = '';
  typeProductSearchClear = '';
  typeCategorySearchClear = '';
  typeProductSearch = '';
  typeCategorySearch = '';
  minValue = 0;
  maxValue = 500;

  checkAll = false;

  // Range price filter
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Mínimo:</b> ' + value;
        case LabelType.High:
          return '<b>Máximo:</b> ' + value;
        default:
          return '' + value;
      }
    }
  };
  productsStorage: ProductStore[];

  categoriesOptions = [
    { name: 'Categoria 1' },
    { name: 'Categoria 2' },
    { name: 'Categoria 3' }
  ];

  constructor(public productStoreService: ProductsStorageService) {

    this.productStoreService.getPageProducts(0, 2, '002', '', '', -1);
   }

  ngOnInit(): void {
    this.productsStorage = PRODUCTS_STORAGE;

  }

  search(f: NgForm): void {
    console.log(f.value)
  }


  selectAllProducts( ){
    this.checkAll = !this.checkAll;

      this.productsStorage.forEach(element => {
        element.selected =  this.checkAll ;
      });

  }

  // Clear search form
  clearSearch(f: NgForm): void {
    if (f) {
      this.nameSeach = '';
      this.skuSearch = '';
      this.typeProductSearch = '';
      this.typeCategorySearch = '';
      this.minValue = 0;
      this.maxValue = 500;
    }
  }
}
