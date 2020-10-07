import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductStore } from '../../../../../models/product.store';
import { Options, LabelType } from 'ng5-slider';

import { ProductsStorageService } from '../../../../services/products-storage.service';
import { PageProductStorage } from '../../../../../models/page.product.store';
import { MarketplaceService } from '../../../../services/marketplace.service';
import { Marketplace } from '../../../../../models/marketplace.model';
import { ActionResult } from '../../../../../enums/actionresult.enum';
import { SelectedProducResponse } from '../../../../../models/selected.products.response';

import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import Swal from 'sweetalert2';
import { ParsedPropertyType } from '@angular/compiler';


@Component({
  selector: 'app-products-store',
  templateUrl: './products-store.component.html',
  styleUrls: ['./products-store.component.css']
})
export class ProductsStoreComponent implements OnInit {

  public loading = true;
  public loadPaginator = false;
  public loadingClear = false;
  public errorProducts = false;
  public empySearch = false;
  public nameSeach = '';
  public skuSearch = '';
  public typeProductSearchClear = '';
  public typeCategorySearchClear = '';
  public typeFamilySearchClear = '';
  public typeProductSearch = '';
  public typeCategorySearch = '';
  public typeFamilySearch = '';
  public minValue = 0;
  public maxValue = 20000;

  productsStorage: ProductStore[];
  pageProducts = new PageProductStorage();
  marketplaces: Marketplace[] = [];
  selectedProductR = new SelectedProducResponse();

  // Paginator
  currentPage = 1;
  selectedPage = 0;
  page = 0;
  size = 5;
  checkAll = false;
  sizes: [{ numer: 5 }, { numer: 10 }, { numer: 20 }, { numer: 30 }];

  // Range price filter
  options: Options = {
    floor: 0,
    ceil: this.maxValue,
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




  constructor(public productStoreService: ProductsStorageService, public marketplaceService: MarketplaceService, public productsStorageUserService: ProductsStorageUserService) {
    this.getMarketplaces();
  }

  getMarketplaces(): void {

    this.marketplaceService.getMarketplaces().subscribe(resp => {
      this.marketplaces = resp;


    }, error => {
      console.log('Error:', error);


    });
  }

  selectChangeHandler(size): void {
    this.size = +size;
    this.loadProductsPaginator(1);
  }

  loadProductsPaginator(page?: number): void {
    this.loadPaginator = true;
    this.productStoreService.
      getPageProducts(this.currentPage = +page - 1, this.size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProducts = this.productStoreService.pageProducts;
        this.loadPaginator = false;
      }, error => {
        this.loading = false;
        this.errorProducts = true;
        this.loadPaginator = false;
      });
  }

  ngOnInit(): void {
    this.loading = true;
    this.errorProducts = false;
    this.productStoreService.getPageProducts(0, this.size, this.skuSearch, this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProducts = this.productStoreService.pageProducts;

        if (this.pageProducts.itemsGrid.length <= 0) {
          this.errorProducts = true;
        }
        this.loading = false;
      }, (error: any) => {
        this.errorProducts = true;
        this.loading = false;
      })
  }



  selectAllProducts(): void {
    this.checkAll = !this.checkAll;

    this.pageProducts.itemsGrid.forEach(element => {
      element.selected = this.checkAll;
    });

  }

  searchProducts(): void {
    this.loadPaginator = true;
    this.empySearch = false;
    this.loadingClear = false;
    this.productStoreService.
      getPageProducts(this.selectedPage = 0, this.size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProducts = this.productStoreService.pageProducts;
        this.loadPaginator = false;
        this.errorProducts = false;
        if (this.pageProducts.itemsGrid.length === 0) {
          this.empySearch = true;
          this.pageProducts.itemsGrid = null;
        }
      }, (error: any) => {
        console.log('Error', error);
        this.loadPaginator = false;
        this.errorProducts = false;
        this.empySearch = true;
      });
  }
  // Clear search form
  clearSearch(f: NgForm): void {

    this.loadingClear = true;
    this.nameSeach = '';
    this.skuSearch = '';
    this.typeProductSearch = '';
    this.typeCategorySearch = '';
    this.typeFamilySearch = '';
    this.minValue = 0;
    this.maxValue = 20000;
    this.productStoreService.
      getPageProducts(this.selectedPage = 0, this.size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProducts = this.productStoreService.pageProducts;
        if (this.pageProducts.itemsGrid.length > 0) {
          this.empySearch = false;
        }
        this.loadingClear = false;
      }, (error: any) => {
        this.loadingClear = false;

      });

  }

  // To send the selected products to custom store
  selectMyProducts(idMarket: any): void {
    if (idMarket != null) {
      let exists_products = "";
      let productList = [];
      this.pageProducts.itemsGrid.forEach(element => {
        if (element.selected === true) {
          productList.push(element.sku);
        }
      });
      if (productList.length != 0) {
        this.productsStorageUserService.storeMyProducts(idMarket, productList).subscribe(resp => {
          this.selectedProductR = resp;
          let p = this.selectedProductR.codeResult;
          if (this.selectedProductR.codeResult === ActionResult.DONE) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Sus productos han sido almacenados correctamente`,
              showConfirmButton: false,
              timer: 5000
            });
          }
          else if (this.selectedProductR.codeResult === ActionResult.PARTIAL) {
            this.selectedProductR.existingProducts.forEach(element => {
              exists_products = element + ", " + exists_products;
            });
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Productos almacenados`,
              text: `Los productos se almacenaron correctamente excepto ${exists_products} que ya se encontraban en su almacen`,
              showConfirmButton: false,
              timer: 5000
            });
          }
          else {
            this.selectedProductR.existingProducts.forEach(element => {
              exists_products = exists_products + ", " + element;
            });
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: `Productos no almacenados`,
              text: `Todos los productos seleccionados ya se encontraban en su almacen`,
              showConfirmButton: false,
              timer: 5000
            });
          }
        })
      } else {
        Swal.fire({
          position: 'top-end',
          title: 'Error en lista',
          text: "Usted no ha seleccionado productos",
          icon: 'warning',
          showConfirmButton: false,
          timer: 5000
        });
      }

    }
  }
}
