import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from 'src/app/models/image.model';
import { ProductCustom } from 'src/app/models/myproducts.custom.model';
import { CommonInfoRequest } from 'src/app/models/upload-images/common-info-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadImagesService {

  URI = environment.URI_ROOT;
  URI_UPLOAD_IMAGES = '/upload/api/bucket';

  constructor(private http: HttpClient) { }
/*de aqui -- igual metodo */
  getImageFromBucket(path: string): Observable<any[]>{
    const params = `${this.URI}${this.URI_UPLOAD_IMAGES}/download-file-from-upload-bucket?pathFile=${path}`;
    return this.http.get<any[]>(params);
  }

  async getImage2Dos(path: string): Promise<any[]> {
    //let result: any[];
    const params = `${this.URI}${this.URI_UPLOAD_IMAGES}/download-file-from-upload-bucket?pathFile=${path}`;
    let result = await this.http.get<any[]>(params).toPromise();
    return result;
  }
  /** Hasta Aqui */

  async uploadImageSyn(fileList: any[], commonInfoList: CommonInfoRequest[]): Promise<CommonInfoRequest[]>{
    const params = `${this.URI}${this.URI_UPLOAD_IMAGES}/upload-file-to-legacy`;
    //let resultList: CommonInfoRequest[] = [];

    for(let i=0; i<commonInfoList.length; i++){
      //let commonInfo: CommonInfoRequest = new CommonInfoRequest(productsList[i].sku, []);
     for(let j=0; j<fileList.length; j++){
        let formData: FormData = new FormData();
        let filename = fileList[j].name.replace(/ /g, "");
        formData.append('multipartFile', fileList[j], filename.trim());
        let result = await this.http.post(params, formData, {responseType: 'text'}).toPromise();
        let image = new Image();
        image.photos = result;
        commonInfoList[i].images.push(image);
     }
    // resultList.push(commonInfo);
    }
    return commonInfoList;
  }

  uploadImage(formData: FormData): Observable<string>{
    const params = `${this.URI}${this.URI_UPLOAD_IMAGES}/upload-file-to-legacy`;
    return this.http.post(params, formData, {responseType: 'text'});
  }

  deleteImages(imageToDelete: string[]): Observable<boolean> {
    let imagesFiltered = imageToDelete.filter(ima => (!ima.startsWith('http://') && !ima.startsWith('https://') ))
    const params = `${this.URI}${this.URI_UPLOAD_IMAGES}/delete-files-list-from-upload-bucket?pathFiles=${imagesFiltered}`;
    return this.http.delete<boolean>(params);
  }

}
