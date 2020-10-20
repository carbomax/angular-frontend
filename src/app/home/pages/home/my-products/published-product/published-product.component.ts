import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageProductStorage } from '../../../../../models/page.product.store';
import { ProductsStorageService } from '../../../../services/products-storage.service';
import { ProductStore } from '../../../../../models/product.store';

@Component({
  selector: 'app-published-product',
  templateUrl: './published-product.component.html',
  styleUrls: ['./published-product.component.css']
})
export class PublishedProductComponent implements OnInit {
  meliAccountSearchClear = '';
  typeStateSearchClear = '';
  disable = true;  

  public loading = true;
  public loadPaginator = false;
  public loadingClear = false;
  public idMeliSearch = '';
  public skuSearch = '';
  public meliAccountSearch = '';
  public typeStateSearch = '';
  public errorProducts = false;
  public empySearch = false;

  // Paginator
  currentPage = 1;
  selectedPage = 0;
  page = 0;
  size = 5;
  checkAll = false;
  sizes: [{ numer: 5 }, { numer: 10 }, { numer: 20 }, { numer: 30 }];

  pageProducts = new PageProductStorage();
  productsSelected: ProductStore[];

   //Loading Modal
   loadingModal = false;

  constructor(public productStoreService: ProductsStorageService) { }

  selectChangeHandler(size): void {
    this.size = +size;
    this.loadProductsPaginator(1);
  }

  loadProductsPaginator(page?: number): void {
    this.loadPaginator = true;
    this.productStoreService.
      getPageProducts(this.currentPage = +page - 1, this.size, this.skuSearch,
        '', -1, -1, 0, 2000)
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
    this.disable = true;
    this.productsSelected = []; 

    this.loading = true;
    this.errorProducts = false;
    this.productStoreService.getPageProducts(0, this.size, this.skuSearch, '', -1 , -1 , 0, 2000)
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

  searchProductsPublished(){}

  // Clear search form
  clearSearch(f: NgForm): void {

    this.loadingClear = true;
    this.idMeliSearch = '';
    this.skuSearch = '';  
    this.meliAccountSearch = '';
    this.typeStateSearch = '';
  }

  selectAllProducts():void {
    this.checkAll = !this.checkAll;

    this.pageProducts.itemsGrid.forEach(element => {
      element.selected = this.checkAll;
      if(element.selected === true) {
        let position1 = this.productsSelected.indexOf(element);
        if(position1 === -1){
          this.productsSelected.push(element);
        }
      }
      else{
        let position = this.productsSelected.indexOf(element);
        if(position !== -1){
          this.productsSelected.splice(position, 1);
        }

      }
    });
    if(this.checkAll === false){
      this.disable = true;
    }else{
      this.disable = false;
    }
  }

  selectProduct(product: ProductStore): void{
    let position = this.productsSelected.indexOf(product);
    if(position === -1){
      product.selected = !product.selected;
      if(product.selected === true) { 
        this.productsSelected.push(product);     
      } 
    }
    else{
      product.selected = !product.selected;      
      if(product.selected === false){
        this.productsSelected.splice(position, 1);
      }
    }
    if(product.selected === false){
      this.disable = true;      
    }else{
      this.disable = false;
    }
  }

}
