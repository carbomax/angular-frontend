import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageProductStorage } from '../../models/page.product.store';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategoryProductStoraje } from '../../models/category.product.storaje';
import { FamilyProductStorage } from '../../models/family.product.store';

@Injectable({
  providedIn: 'root'
})
export class ProductsStorageService {

  URI = environment.URI_ROOT;
  URI_SERVICE_PRODUCTS = '/products/api';

  pageProducts: PageProductStorage;
  categories: CategoryProductStoraje[] = [];
  families: FamilyProductStorage[] = [];

  constructor(private http: HttpClient) {
    this.pageProducts = new PageProductStorage();
    this.getCategories();
    this.getFamiles();
  }

  getPageProducts(page: number, size: number, sku: string, nameProduct: string,
    categoryId: number, familyId: number, minPrice: number, maxPrice: number): Observable<PageProductStorage> {

    const uri = `${this.URI}${this.URI_SERVICE_PRODUCTS}/items-by-filters/${page}/${size}
    ?sku=${sku}&nameProduct=${nameProduct}&categoryId=${categoryId}&familyId=${familyId}
    &minPrice=${minPrice}&maxPrice=${maxPrice}`;

    console.log(uri)
    return this.http.get<PageProductStorage>(uri).pipe(map((resp: any) => {
      this.pageProducts.itemsGrid = resp.itemsGrid;
      this.pageProducts.totalElements = resp.totalElements;
      this.pageProducts.currentStock = resp.currentStock;
      this.pageProducts.size = resp.size;
      this.pageProducts.totalPages = resp.totalPages;
      this.pageProducts.last = resp.last;
      this.pageProducts.first = resp.first;
      this.pageProducts.sort = resp.sort;
      this.pageProducts.totalProducts = resp.totalProducts;
      return this.pageProducts;
    }));
  }

  getCategories(): void {
    this.http.get<CategoryProductStoraje[]>(`${this.URI}${this.URI_SERVICE_PRODUCTS}/categories`).subscribe(resp => this.categories = resp);
  }

  getFamiles(): void {
    this.http.get<FamilyProductStorage[]>(`${this.URI}${this.URI_SERVICE_PRODUCTS}/families`).subscribe(resp => this.families = resp);
  }

}
