import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectedProducResponse } from '../../models/selected.products.response';
import { MarketplaceDetails } from '../../models/marketplace.details';
import { PageProductMeliStorage } from '../../models/page.myproduct.custom.model';
import { EditableProductModel } from '../../models/editable.product.model';
import { Image } from 'src/app/models/image.model';
import { ProductCustom } from '../../models/myproducts.custom.model'

import { AuthService } from 'src/app/core/services/auth.service'
import { CommonInfoRequest } from 'src/app/models/upload-images/common-info-request.model';


@Injectable({
  providedIn: 'root'
})
export class ProductsStorageUserService {

  URI = environment.URI_ROOT;
  URI_PRODUCTS_ACTIONS = '/products/api';
  URI_UPLOAD_ACTIONS = '/upload/api';
  pageProductsMeli: PageProductMeliStorage;
  list: any[];
  profileId: number;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.pageProductsMeli = new PageProductMeliStorage();
    this.list = [];
    this.profileId = this.authService.authenticationDataExtrac().profileId;
  }

  storeMyProducts(idProfile: number, marketplace: Number, products: any[]): Observable<SelectedProducResponse>{
    let string_profile = idProfile.toString();
    let encodeProfile = btoa(string_profile);

    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/select-myproducts/${encodeProfile}?marketplace=${marketplace}
    &products=${products}`;

    return this.http.get<SelectedProducResponse>(params);
  }

  getDetailsMarketplaces(idProfile: number): Observable<MarketplaceDetails[]>{
    let string_profile = idProfile.toString();
    let encodeProfile = btoa(string_profile);

    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/marketplaces-details/${encodeProfile}`;
    return this.http.get<MarketplaceDetails[]>(params);
  }

  getPageMyCustomProducts(idProfile: number, page: number, size: number, sku: string, nameProduct: string,
    state: number, familyId: number, minPrice: number, maxPrice: number): Observable<PageProductMeliStorage> {

      let string_profile = idProfile.toString();
      let encodeProfile = btoa(string_profile);

    const uri = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/items-meli-filters/${page}/${size}/${encodeProfile}
    ?sku=${sku}&nameProduct=${nameProduct}&state=${state}&familyId=${familyId}
    &minPrice=${minPrice}&maxPrice=${maxPrice}`;

    return this.http.get<PageProductMeliStorage>(uri).pipe(map((resp: any) => {
      this.pageProductsMeli.itemsMeliGrid = resp.itemsMeliGridList;
      this.pageProductsMeli.totalElements = resp.totalElements;
      this.pageProductsMeli.size = resp.size;
      this.pageProductsMeli.totalPages = resp.totalPages;
      this.pageProductsMeli.last = resp.last;
      this.pageProductsMeli.first = resp.first;
      this.pageProductsMeli.sort = resp.sort;
      this.pageProductsMeli.totalProducts = resp.totalProducts;
      return this.pageProductsMeli;
    }));
  }

  getCustomProduct(id: number): Observable<EditableProductModel>{
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/product-info/${id}`;
    return this.http.get<EditableProductModel>(params);
  }

  updateCustomProduct(product: EditableProductModel, imageToDelete: number[]): Observable<EditableProductModel>{
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/edit-product-info/?imagesToDelete=${imageToDelete}`;
    return this.http.put<EditableProductModel>(params, product);
  }

  /**Metodo de Posible sustitucion por el metodo del servicio upload-images.services **/
  uploadImage(formData: FormData): Observable<any>{
    const params = `${this.URI}${this.URI_UPLOAD_ACTIONS}/file/upload-file?uri=${this.URI}`;
    return this.http.post<any>(params, formData);
  }

/**Metodo de Posible sustitucion por el metodo del servicio upload-images.services **/
  async uploadImageSyn(fileList: any[], productsList: ProductCustom[]): Promise<any>{
    const params = `${this.URI}${this.URI_UPLOAD_ACTIONS}/file/upload-file?uri=${this.URI}`;
    let resultList: any[] = [];

    for(let i=0; i<fileList.length; i++){
     for(let j=0; j<productsList.length; j++){
        let formData: FormData = new FormData();
        let filename = productsList[j].sku + '_';
        filename = filename + this.getRandomInt(1,1000000) + "_" + fileList[i].name.replace(/ /g, "");
        formData.append('image', fileList[i], filename.trim());
        let result = await this.http.post<any>(params, formData).toPromise();
        resultList.push(result);
     }
    }
    return resultList;
  }

  deleteImages(imageToDelete: string[]): Observable<any>{
    let finalImageList = [];
    imageToDelete.forEach(element => {
      var position = element.lastIndexOf("/");
      finalImageList.push(element.substring(position+1));
 });
    const params = `${this.URI}${this.URI_UPLOAD_ACTIONS}/file-delete/${finalImageList}`;
    return this.http.delete<any>(params);
  }

  updateCommonInfo(idProfile: number, description: string, productList: ProductCustom[], imageToAddList: string[]): Observable<any>{
    let string_profile = idProfile.toString();
    let encodeProfile = btoa(string_profile);
    let imageListToSend = [];

    imageToAddList.forEach(element =>{
      if(element.length !== 0){
        let ima = new Image();
        ima.photos = element;
        imageListToSend.push(ima);
      }
    })

    let skuList: string[] = [];
    productList.forEach(element => {
      skuList.push(element.sku);
    });


    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/store-common-data/${encodeProfile}?description=${description}&skuList=${skuList}`;
    return this.http.put<any>(params, imageListToSend);
  }

  //nuevo metodo
  updateCommonInfo2(idProfile: number, description: string, commonInfoList: CommonInfoRequest[]): Observable<any>{
    let string_profile = idProfile.toString();
    let encodeProfile = btoa(string_profile);

    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/store-common-data2/${encodeProfile}?description=${description}`;
    return this.http.put<any>(params, commonInfoList);
  }

  getFullProductsById(idProductsList: number[]): Observable<any>{
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/full-product-id/?ids=${idProductsList}`;
    return this.http.get<any>(params);
  }

  deleteProductsFromStore(productsList: ProductCustom[]): Observable<boolean>{
    let idList: number[] = [];
    productsList.forEach(elem => {
      idList.push(elem.id)
    })

    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/delete-products/${idList}`;
    return this.http.delete<boolean>(params);
  }

  deleteProductFromStore(product: ProductCustom): Observable<boolean>{
    const params = `${this.URI}${this.URI_PRODUCTS_ACTIONS}/delete-product/${product.id}`;
    return this.http.delete<boolean>(params);
  }

  // Retorna un número aleatorio entre min (incluido) y max (excluido)
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Retorna un entero aleatorio entre min (incluido) y max (excluido)
  //¡Usando Math.round() te dará una distribución no-uniforme!
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
