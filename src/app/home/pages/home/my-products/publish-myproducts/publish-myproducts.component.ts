import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageProductMeliStorage } from 'src/app/models/page.myproduct.custom.model';
import { ProductCustom } from 'src/app/models/myproducts.custom.model';
import { Options, LabelType } from 'ng5-slider';

import { ProductsStorageService } from '../../../../services/products-storage.service';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { PaginationInstance } from 'ngx-pagination';
import {MatDialog, MatDialogModule, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PopupAddcommoninfoComponent } from '../../../../components/modals/popup-addcommoninfo/popup-addcommoninfo.component';
import { States } from 'src/app/enums/states.enum';

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
  public typeStateSearchClear = ''; 
  public typeFamilySearchClear = '';
  public typeProductSearch = '';  
  public typeStateSearch = '';
  public typeFamilySearch = '';
  public minValue = 0;
  public maxValue = 20000;  

  productsStorage: ProductCustom[];
  pageProducts = new PageProductMeliStorage();
  stateEnum = States;

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

  constructor(public productStoreService: ProductsStorageService, public productStoreUserService: ProductsStorageUserService, public dialog: MatDialog) { 
    
  }

  //Change size elements of the table
  selectChangeHandler(size): void {
    this.size = +size;
    this.loadProductsPaginator(1);
  }

  loadProductsPaginator(page?: number): void {
    this.loadPaginator = true;
    this.productStoreUserService.
    getPageMyCustomProducts(this.currentPage = +page - 1, this.size, this.skuSearch,
        this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemCustomGrid => {
        this.pageProducts = this.productStoreUserService.pageProductsMeli;
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
    this.productStoreUserService.getPageMyCustomProducts(0, this.size, this.skuSearch, this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemCustomGrid => {        
        this.pageProducts = this.productStoreUserService.pageProductsMeli;
        if (this.pageProducts.itemsMeliGrid.length <= 0) {
          this.errorProducts = true;
        }
        this.loading = false;
      }, (error: any) => {
        this.errorProducts = true;
        this.loading = false;
      })
  }
/*ver OJO
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
*/
  selectAllProducts():void {
    this.checkAll = !this.checkAll;

    this.pageProducts.itemsMeliGrid.forEach(element => {
      element.selected = this.checkAll;
    });

  }

  /* ********************  Here begin the searching ************************** */
  searchProducts(): void {
    this.loadPaginator = true;
    this.empySearch = false;
    this.loadingClear = false;
    this.productStoreUserService.
    getPageMyCustomProducts(this.selectedPage = 0, this.size, this.skuSearch,
      this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
    .subscribe(pageItemCustomGrid => {
      this.pageProducts = this.productStoreUserService.pageProductsMeli;
      this.loadPaginator = false;
      this.errorProducts = false;
      if (this.pageProducts.itemsMeliGrid.length === 0) {
        this.empySearch = true;
        this.pageProducts.itemsMeliGrid = null;
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
    this.typeStateSearch = '';
    this.typeFamilySearch = '';
    this.minValue = 0;
    this.maxValue = 20000;
    this.productStoreUserService.
    getPageMyCustomProducts(this.selectedPage = 0, this.size, this.skuSearch,
        this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProducts = this.productStoreUserService.pageProductsMeli;
        if (this.pageProducts.itemsMeliGrid.length > 0) {
          this.empySearch = false;
        }
        this.loadingClear = false;
      }, (error: any) => {
        this.loadingClear = false;

      });

  }


  /* ******************************* Here begin the Component Modal to Publish Products ****************************** */
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
