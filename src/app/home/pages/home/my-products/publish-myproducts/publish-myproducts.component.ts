import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageProductStorage } from 'src/app/models/page.product.store';
import { ProductStore } from 'src/app/models/product.store';
import { Options, LabelType } from 'ng5-slider';

import { ProductsStorageService } from '../../../../services/products-storage.service';
import { PaginationInstance } from 'ngx-pagination';
import {MatDialog, MatDialogModule, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PopupAddcommoninfoComponent } from '../../../../components/modals/popup-addcommoninfo/popup-addcommoninfo.component';

declare function initializePlugin();

@Component({
  selector: 'app-publish-myproducts',
  templateUrl: './publish-myproducts.component.html',
  styleUrls: ['./publish-myproducts.component.css']
})
export class PublishMyproductsComponent implements OnInit {

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

  // Paginator
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

  constructor(public productStoreService: ProductsStorageService, public dialog: MatDialog) { 
    
  }

  selectChangeHandler(size): void {

    const pageProductsTemporal = new PageProductStorage();
    pageProductsTemporal.itemsGrid = this.pageProducts.itemsGrid;
    this.loadPaginator = true;
    if (this.size > size) {
      this.productStoreService.getPageProducts(this.selectedPage, this.size = +size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch,
        this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
        .subscribe(pageItemGrid => {
          console.log(pageItemGrid)
          if (pageItemGrid.itemsGrid.length > 0) {
            this.pageProducts = this.productStoreService.pageProducts;
          } else {
            this.pageProducts.itemsGrid = pageProductsTemporal.itemsGrid;
          }

          this.loading = false;
          this.loadPaginator = false;

        }, (error: any) => {
          this.errorProducts = true;
          this.loading = false;
          this.loadPaginator = false;

        })
    } else {
      this.productStoreService.getPageProducts(0, this.size = +size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
        .subscribe(pageItemGrid => {
          console.log(pageItemGrid)
          if (pageItemGrid.itemsGrid.length > 0) {
            this.pageProducts = this.productStoreService.pageProducts;
          } else {
            this.pageProducts.itemsGrid = pageProductsTemporal.itemsGrid;
          }
          this.selectedPage = 0;
          this.loading = false;
          this.loadPaginator = false;

        }, (error: any) => {
          this.errorProducts = true;
          this.loading = false;
          this.loadPaginator = false;

        })
    }

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

  onSelect(page: number): void {
    this.loadPaginator = true;
    this.selectedPage = page;
    this.productStoreService.
    getPageProducts(this.selectedPage, this.size, this.skuSearch,
      this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
    .subscribe(pageItemGrid => {
      this.pageProducts = this.productStoreService.pageProducts;
      this.loadPaginator = false;
    }, error => this.loading = false);

  }

  next(): void {
    this.loadPaginator = false;
    if (!this.pageProducts.last) {
      this.loadPaginator = true;
      this.productStoreService.
      getPageProducts(this.selectedPage += 1, this.size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
        .subscribe(pageItemGrid => { this.pageProducts = this.productStoreService.pageProducts; this.loadPaginator = false; });
    }
  }

  previous(): void {
    this.loadPaginator = false;
    if (!this.pageProducts.first) {
      this.loadPaginator = true;
      this.productStoreService.
      getPageProducts(this.selectedPage -= 1, this.size, this.skuSearch,
        this.nameSeach, this.typeCategorySearch === '' ? -1 : +this.typeCategorySearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProducts = this.productStoreService.pageProducts; this.loadPaginator = false;
        });

    }


  }

  selectAllProducts():void {
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
        if(this.pageProducts.itemsGrid.length > 0){
          this.empySearch = false;
  }
    this.loadingClear = false;
  }, (error: any) => {
    this.loadingClear = false;
  });
}
  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(PopupAddcommoninfoComponent, dialogConfig);
/*
    dialogRef.afterClosed().subscribe(
      data => {
                this.saveNewCourse(data);
      }, error => this.logService.print(error, LogService.ERROR_MSG));*/
  }
/*
private saveNewCourse(courseToInsert: Course) {
    this.apiService.addCourse(courseToInsert).subscribe();
  }*/
  method2(event): void{
    var miVariable1 = "tete";
  }

}
