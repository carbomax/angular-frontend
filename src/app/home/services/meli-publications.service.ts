import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeliCategory } from '../../models/meli-category.model';
import { ProductCustom } from '../../models/myproducts.custom.model';
import { AccountMarginModel } from '../../models/relatioship-account-margin.model';
import { Attributes } from '../../models/meli-publication/attributes.meli';
import { Shipping } from '../../models/meli-publication/shipping.meli';
import { ItemPictures } from '../../models/meli-publication/pictures.meli.request';
import { SaleTerms } from '../../models/meli-publication/sale-terms.meli';
import { ItemMeliRequest } from '../../models/meli-publication/item.meli.request';
import { ItemCustomModel } from '../../models/meli-publication/item.custom.model';
import { ProductsStorageUserService } from './products-storage-user.service'; 
import { EditableProductModel } from 'src/app/models/editable.product.model';


@Injectable({
  providedIn: 'root'
})
export class MeliPublicationsService {  

  URI_MELI_BUSINESS = `${environment.URI_ROOT}/meli/api/accounts`;
  URI = environment.URI_MELI_PUBLIC;

  responsePublicationList: any[]; 

  constructor(private http: HttpClient, public productsUserService: ProductsStorageUserService) {
     this.responsePublicationList = [];
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

  createPublicationList(relationshipList: AccountMarginModel[], idCategory: string, warranty: string, productsSelected: ProductCustom[]): void{
    
    let itemCustomList: ItemCustomModel[] = [];
    let productIdList: number[] = [];
    let responseList: EditableProductModel[] = [];
    productsSelected.forEach(element => {
      productIdList.push(element.id);
    }); 

    this.productsUserService.getFullProductsById(productIdList).subscribe(response =>{
      responseList = response;
      relationshipList.forEach(relation => {   
        itemCustomList = [];   
        responseList.forEach(element => {
          let priceFinal = 0;
          if(relation.idMargin === -1){
            priceFinal = element.price;
          }
          else if(relation.typeMargin === 1/*fijo*/){
            priceFinal = element.price + relation.valueMargin;
          }
          else{
            /*Por Ciento*/
            priceFinal = (element.price * (relation.valueMargin/100)) + element.price;
          }
  
          let imagesList: ItemPictures[] = [];          
          element.images.forEach(image => {            
            imagesList.push(new ItemPictures(image.photos));            
          });
  
          let shipping: Shipping = new Shipping("me2", false, false, []);
          let saleTerms: SaleTerms[] = [];
          saleTerms.push(new SaleTerms("WARRANTY_TYPE", "Tipo de garantía", "2230280", "Garantia del vendedor"));
  
          let attributes: Attributes[] = [];
          attributes.push(new Attributes("SELLER_SKU", "SKU", element.sku));
  
          let item = new ItemMeliRequest(element.productName, idCategory, priceFinal, "UYU", element.currentStock.toString(), "buy_it_now", "new",
          "bronze", element.description, imagesList, attributes, null, null, null);        
          itemCustomList.push(new ItemCustomModel(item, element.id));          
        })
    
        const params = `${this.URI_MELI_BUSINESS}/publications-flow/${relation.idAccount}?idMargin=${relation.idMargin}`;
        this.http.post<any>(params, itemCustomList).subscribe(result =>{});        
      });
     
      });      
            
  }


}
