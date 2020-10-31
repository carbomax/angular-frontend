import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeliCategory } from '../../models/meli-category.model';


@Injectable({
  providedIn: 'root'
})
export class MeliPublicationsService {

  

  URI = environment.URI_MELI_PUBLIC;

  constructor(private http: HttpClient) {
   
   }

  getMeliCategories(): Observable<MeliCategory[]>{   
    let meliCategoryList: MeliCategory[] = [];   
    const params = `${this.URI}/sites/MLU/categories`;

    return this.http.get<any[]>(params).pipe(map((resp: any[]) => {  
      resp.forEach(element => {
        let meliCategory = new MeliCategory();
        meliCategory.id = element.id;
        meliCategory.name = element.name;
        meliCategoryList.push(meliCategory);
      });   
      return meliCategoryList;
    }));     
  }

  getMeliSubCategories(idCategory: string): Observable<MeliCategory>{
    const params = `${this.URI}/categories/${idCategory}`;
    return this.http.get<MeliCategory>(params).pipe(map((resp: any) => { 
      let meliCategory = new MeliCategory();    
      meliCategory.id = resp.id;
      meliCategory.name = resp.name;
      meliCategory.picture = resp.picture;
      meliCategory.permalink = resp.permalink;
      meliCategory.total_items_in_this_category = resp.total_items_in_this_category;
      meliCategory.path_from_root = resp.path_from_root;
      meliCategory.children_categories = resp.children_categories;
      meliCategory.attribute_types = resp.attribute_types;      
      return meliCategory; 
    }));
  }

  getMeliInfoCategory(idCategory: string): Observable<any>{
    const params = `${this.URI}/sites/MLU/search?category=${idCategory}`;
    return this.http.get<any>(params); 
  }
}
