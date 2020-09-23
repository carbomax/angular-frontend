import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageProductStorage } from 'src/app/models/page.product.store';
import { ProductStore } from 'src/app/models/product.store';
import { Options, LabelType } from 'ng5-slider';

import { ProductsStorageService } from '../../../../services/products-storage.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-publish-myproducts',
  templateUrl: './publish-myproducts.component.html',
  styleUrls: ['./publish-myproducts.component.css']
})
export class PublishMyproductsComponent implements OnInit {

  public loading = true;
  public loadPaginator = false;
  public nameSeach = '';
  public skuSearch = '';
  public typeProductSearchClear = '';
  public typeCategorySearchClear = '';
  public typeProductSearch = '';
  public typeCategorySearch = '';
  public minValue = 0;
  public maxValue = 500;

  productsStorage: ProductStore[];
  pageProducts = new PageProductStorage();

  // Paginator
  selectedPage = 0;
  page = 0;
  size = 5;
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

  constructor(public productStoreService: ProductsStorageService) { }



  ngOnInit(): void {
    this.loading = true;
    this.productStoreService.getPageProducts(0, 3, '', '', -1, -1, -1, -1)
      .subscribe(pageItemGrid => {
        console.log(pageItemGrid)
        this.pageProducts = this.productStoreService.pageProducts;
        this.loading = false;
      })
  }

  onSelect(page: number): void {
    this.loadPaginator = true;
    this.selectedPage = page;
    this.productStoreService.
      getPageProducts(this.selectedPage, 3, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, -1, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => { this.pageProducts = this.productStoreService.pageProducts; this.loadPaginator = false; });

  }

  next(): void {
    this.loadPaginator = false;
    if (!this.pageProducts.last) {
      this.loadPaginator = true;
      this.productStoreService.
        getPageProducts(this.selectedPage += 1, 3, this.skuSearch,
          this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, -1, this.minValue, this.maxValue)
        .subscribe(pageItemGrid => { this.pageProducts = this.productStoreService.pageProducts; this.loadPaginator = false; });
    }
  }

  previous(): void {
    this.loadPaginator = false;
    if (!this.pageProducts.first) {
      this.loadPaginator = true;
      this.productStoreService.
        getPageProducts(this.selectedPage -= 1, 3, this.skuSearch,
          this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, -1, this.minValue, this.maxValue)
        .subscribe(pageItemGrid => {this.pageProducts = this.productStoreService.pageProducts;  this.loadPaginator = false;

          console.log(this.pageProducts)
        });

    }


  }

  search(f: NgForm): void {
    console.log(f.value)
  }


  selectAllProducts() {
    this.checkAll = !this.checkAll;

    this.productsStorage.forEach(element => {
      element.selected = this.checkAll;
    });

  }

  searchProducts(): void {
    this.loadPaginator = true;
    this.productStoreService.
      getPageProducts(this.selectedPage = 0, 3, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, -1, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {this.pageProducts = this.productStoreService.pageProducts; this.loadPaginator = false;});
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
      this.productStoreService.
        getPageProducts(this.selectedPage = 0, 3, this.skuSearch,
          this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, -1, this.minValue, this.maxValue)
        .subscribe(pageItemGrid => this.pageProducts = this.productStoreService.pageProducts);
    }
  }


}
