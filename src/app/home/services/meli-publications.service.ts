import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeliCategory } from '../../models/meli-publication/meli-category.model';
import { ProductCustom } from '../../models/myproducts.custom.model';
import { AccountMarginModel } from '../../models/relatioship-account-margin.model';
import { Attributes } from '../../models/meli-publication/attributes.meli';
import { Shipping } from '../../models/meli-publication/shipping.meli';
import { ItemPictures } from '../../models/meli-publication/pictures.meli.request';
import { SaleTerms } from '../../models/meli-publication/sale-terms.meli';
import { ItemMeliRequest } from '../../models/meli-publication/item.meli.request';
import { ItemCustomModel } from '../../models/meli-publication/item.custom.model';
import { MeliPredictorCategory } from '../../models/meli-publication/meli-predictor-category.model';
import { ProductsStorageUserService } from './products-storage-user.service';
import { AuthService } from '../../core/services/auth.service';
import { SystemConfigService } from '../services/systems-config.service';
import { EditableProductModel } from 'src/app/models/editable.product.model';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';
import { AttributesRequiredModel } from 'src/app/models/meli-publication/meli-attributes-required.model';
import { SystemConfigModel } from 'src/app/models/system-configuration/system-config.model';



@Injectable({
  providedIn: 'root'
})
export class MeliPublicationsService {

  URI_MELI_BUSINESS = `${environment.URI_ROOT}/meli/api/accounts`;
  URI = environment.URI_MELI_PUBLIC;

  responsePublicationList: any[];
  attributesList: AttributesRequiredModel[];

  constructor(private http: HttpClient, public productsUserService: ProductsStorageUserService, private authService: AuthService, private configService: SystemConfigService) {
     this.responsePublicationList = [];
     this.attributesList = [];
  }

  getMeliCategories(): Observable<MeliCategory[]>{
    let meliCategoryList: MeliCategory[] = [];
    const params = `${this.URI}/sites/MLU/categories`;

    return this.http.get<any[]>(params).pipe(map((resp: any[]) => {
      resp.forEach(element => {
          if(element.id !== "MLU1953") { // MLU1953 = "Otras categorias"
          let meliCategory = new MeliCategory();
          meliCategory.id = element.id;
          meliCategory.name = element.name;
          meliCategoryList.push(meliCategory);
        }
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
      meliCategory.shipping_modes = resp.settings.shipping_modes;
      return meliCategory;
    }));
  }

  getCategoryByPredictorNO(titleProduct: string): Observable<MeliPredictorCategory[]>{
    const params = `${this.URI}/sites/MLU/domain_discovery/search?limit=${3}&q=${titleProduct}`;
    let meliPredictorList: MeliPredictorCategory[] = [];

   return this.http.get<any[]>(params).pipe(map((resp: any[]) => {
          if(resp.length > 0){
              resp.forEach(element => {
                let meliPredictorCategory = new MeliPredictorCategory(element.domain_id, element.domain_name, element.category_id,
                                    element.category_name, element.attributes);
                meliPredictorList.push(meliPredictorCategory);
              });
            }
            return meliPredictorList;
       }));
   }

   getCategoryByPredictor(titleProduct: string): Observable<any[]>{
    const params = `${this.URI}/sites/MLU/domain_discovery/search?limit=${3}&q=${titleProduct}`;
    let meliPredictorList: MeliPredictorCategory[] = [];

   return this.http.get<any>(params);
   }

  getMeliInfoCategory(idCategory: string): Observable<any>{
    const params = `${this.URI}/sites/MLU/search?category=${idCategory}`;
    return this.http.get<any>(params);

  }

  createPublicationList(relationshipList: AccountMarginModel[], idCategory: string, warrantyType: number, warrantyTime: number, warranty: boolean, productsSelected: ProductCustom[]): void{

    let itemCustomList: ItemCustomModel[] = [];

    this.getAttributesRequired(idCategory).subscribe(async attr => {
    let attributesRequired = attr;

    /*Obtiene estos valores de la configuracion del sistema*/
    let scData = this.getSystemConfig();
    let listingType = (await scData).publication_config.publication_type;
    let flex = (await scData).publication_config.flex === 'yes' ? 1 : 0;

    relationshipList.forEach(relation => {
      itemCustomList = [];
      productsSelected.forEach(element => {
        let priceFinal = 0;
        if(relation.idMargin === -1){
          priceFinal = Math.round(element.priceUYU);
        }
        else if(relation.typeMargin === 1/*fijo*/){
          priceFinal = Math.round(element.priceUYU + relation.valueMargin);
        }
        else{
          /*Por Ciento*/
          priceFinal = Math.round((element.priceUYU * (relation.valueMargin/100)) + element.priceUYU);
        }

        let imagesList: ItemPictures[] = [];
        element.images.forEach(image => {
          imagesList.push(new ItemPictures(image.photos));
        });

        let shipping: Shipping = new Shipping("me2", false, false, []);

        let saleTerms: SaleTerms[] = [];
        warrantyType = +warrantyType;
        if(warranty === true)
        {
          if(warrantyType === 2230279){
              saleTerms.push(new SaleTerms("WARRANTY_TYPE", "Garantía de fábrica"));
            }
          else if(warrantyType === 2230280){
              saleTerms.push(new SaleTerms("WARRANTY_TYPE", "Garantía del vendedor"));
            }
          let days_warranty = warrantyTime.toString() + " días";
          saleTerms.push(new SaleTerms("WARRANTY_TIME", days_warranty));
        }


        let attributes: Attributes[] = [];
        attributes.push(new Attributes("SELLER_SKU", "SKU", element.sku));
        if(attributesRequired.length !== 0){
          attributesRequired.forEach( f => { attributes.push(new Attributes( f.id, null, "N/A"));});
      }
        let tittle = element.name.length > 60 ? element.name.substring(0,60) : element.name;
        let item = new ItemMeliRequest(tittle, idCategory, priceFinal, "UYU", element.currentStock.toString(), "buy_it_now", "new",
        listingType, element.description, imagesList, attributes, null, shipping, warranty ? saleTerms : null, ["immediate_payment"]);
        itemCustomList.push(new ItemCustomModel(item, element.id, element.sku, element.images, element.price_costUYU,
          element.price_costUSD, element.priceUYU));

      })

      const params = `${this.URI_MELI_BUSINESS}/publications-flow/${relation.idAccount}?idMargin=${relation.idMargin}&flex=${flex}`;
      this.http.post<any>(params, itemCustomList).subscribe(result =>{});
    });
  }, error => {});
  }

  createPublicationByEditableProduct(relationshipList: AccountMarginModel[], idCategory: string, warrantyType: number, warrantyTime: number, warranty: boolean, productSelected: EditableProductModel, reloadConfig: boolean): void{

    let itemCustomList: ItemCustomModel[] = [];

    this.getAttributesRequired(idCategory).subscribe(async attr => {
        let attributesRequired = attr;

        /*Obtiene estos valores de la configuracion del sistema*/
        let scData = this.getSystemConfig();
        let listingType = (await scData).publication_config.publication_type;
        let flex = (await scData).publication_config.flex === 'yes' ? 1 : 0;

        relationshipList.forEach(relation => {
          itemCustomList = [];
          let priceFinal = 0;

        if(relation.idMargin === -1 || !reloadConfig ){// Para el republicar // Quitar validacion "!reloadConfig" despues de arreglar todo como va
          priceFinal = Math.round(productSelected.price);
        }
        else if(relation.typeMargin === 1/*fijo*/){
          priceFinal = Math.round(productSelected.price + relation.valueMargin);
        }
        else{
          /*Por Ciento*/
          priceFinal = Math.round((productSelected.price * (relation.valueMargin/100)) + productSelected.price);
        }

        let imagesList: ItemPictures[] = [];
        productSelected.images.forEach(image => {
          imagesList.push(new ItemPictures(image.photos));
        });

        let shipping: Shipping = new Shipping("me2", false, false, []);

        let saleTerms: SaleTerms[] = [];
        warrantyType = +warrantyType;
        if(warranty === true)
        {
          if(warrantyType === 2230279){
              saleTerms.push(new SaleTerms("WARRANTY_TYPE", "Garantía de fábrica"));
            }
          else if(warrantyType === 2230280){
              saleTerms.push(new SaleTerms("WARRANTY_TYPE", "Garantía del vendedor"));
            }
          let days_warranty = warrantyTime.toString() + " días";
          saleTerms.push(new SaleTerms("WARRANTY_TIME", days_warranty));
        }

        let attributes: Attributes[] = [];
        attributes.push(new Attributes("SELLER_SKU", "SKU", productSelected.sku));
        if(attributesRequired.length !== 0){
            attributesRequired.forEach( f => { attributes.push(new Attributes( f.id, null, "N/A"));});
        }

        let tittle = productSelected.productName.length > 60 ? productSelected.productName.substring(0,60) : productSelected.productName;
        let item = new ItemMeliRequest(tittle, idCategory, priceFinal, "UYU", productSelected.currentStock.toString(), "buy_it_now", "new",
        listingType, productSelected.description, imagesList, attributes, null, shipping, warranty ? saleTerms : null, ["immediate_payment"]);
        itemCustomList.push(new ItemCustomModel(item, productSelected.id, productSelected.sku, productSelected.images, productSelected.price_costUYU,
          productSelected.price_costUSD, productSelected.price));


        const params = `${this.URI_MELI_BUSINESS}/publications-flow/${relation.idAccount}?idMargin=${relation.idMargin}&flex=${flex}`;
        this.http.post<any>(params, itemCustomList).subscribe(result =>{});
      });
    }, error => {});


  }

  updateProductPublish(productPublished: ProductMeliPublished, relationshipList: AccountMarginModel[], reloadConfig: boolean): Observable<ProductMeliPublished> {
      const params = `${this.URI_MELI_BUSINESS}/update-publication`;
      let priceFinal = 0;
      relationshipList.forEach(relation => {

            if(relation.idMargin === -1 || !reloadConfig){ // no fue reconfigurado
              priceFinal = Math.round(+productPublished.pricePublication);
            }
            else if(relation.typeMargin === 1/*fijo*/){
              priceFinal = Math.round((+productPublished.pricePublication) + relation.valueMargin);
            }
            else{
              /*Por Ciento*/
              priceFinal = Math.round((+productPublished.pricePublication * (relation.valueMargin/100)) + (+productPublished.pricePublication));
            }
            productPublished.pricePublication = priceFinal.toString();

            let tittle = productPublished.title.length > 60 ? productPublished.title.substring(0,60) : productPublished.title;
            productPublished.title = tittle;
      });

      return this.http.put<any>(params, productPublished);
  }

  getAttributesRequired(categoryId: string): Observable<AttributesRequiredModel[]>{
    this.attributesList = [];
    const params = `${this.URI}/categories/${categoryId}/attributes`;

    return this.http.get<AttributesRequiredModel[]>(params).pipe(map((resp: any[]) => {
      resp.forEach(element => {
        if(element.tags.required){
          let attributeRequired = new AttributesRequiredModel(element.id, element.name, element.tags, element.value_type, element.value_max_length,
            element.values, element.allowed_units, element.attribute_group_id, element.attribute_group_name);
          this.attributesList.push(attributeRequired);
        }
      });
      return this.attributesList;
    }));

  }

  async getSystemConfig(): Promise<SystemConfigModel> {
    let scData = new SystemConfigModel();
    scData = await this.configService.readAttributesConfig().toPromise();
    return scData;
  }

}
