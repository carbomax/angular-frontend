import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SystemConfigModel } from '../../models/system-configuration/system-config.model'
import { SynchronizationConfigModel } from 'src/app/models/system-configuration/synchronization-config.model';
import { PublicationConfigModel } from 'src/app/models/system-configuration/publication-config.model';
import { MLUListingType } from '../../models/meli-publication/meli-listing-type.model';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService {

  URI = environment.URI_ROOT;
  URI_SERVICE_CONFIG = `${this.URI}/user/api/systemConfig`;
  URI_MELI_LISTING_TYPE = `${environment.URI_MELI_PUBLIC}/sites/MLU/listing_types`;

  constructor(private http: HttpClient) {
  }

  updateAttributesConfig(publiConfig?: PublicationConfigModel, syncConfig?: SynchronizationConfigModel): Observable<SystemConfigModel> {
    let sysResult = new SystemConfigModel();
    let obj = new SystemConfigModel();

    if(publiConfig !== null) {
      obj.publication_config = publiConfig;
    }

    if(syncConfig !== null && syncConfig !== undefined) {
      obj.synchronization_config = syncConfig;
    }

    return this.http.put<SystemConfigModel>(`${this.URI_SERVICE_CONFIG}/update`, obj)
    .pipe(
      map( (resp: any) => {
        sysResult = resp;
        return sysResult;
      })
    );

  }

  readAttributesConfig(): Observable<SystemConfigModel> {
    let sysResult = new SystemConfigModel();

    return this.http.get<SystemConfigModel>(`${this.URI_SERVICE_CONFIG}`)
    .pipe(
      map( (resp: any) => {
        sysResult = resp;
        return sysResult;
      })
    );

  }

  getMLUListingTypes(): Observable<MLUListingType[]>{
    let listingTypeMLUList: MLUListingType[] = [];
    const params = this.URI_MELI_LISTING_TYPE;

    return this.http.get<any[]>(params).pipe(map((resp: any[]) => {
      resp.forEach(element => {
        let listingType = new MLUListingType(element.site_id, element.id, element.name);
        listingTypeMLUList.push(listingType);
      });
      return listingTypeMLUList;
    }));
  }
 
}
