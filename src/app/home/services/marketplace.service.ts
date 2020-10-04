import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Marketplace } from '../../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  URI = environment.URI_ROOT;
  URI_MARKETPLACE = '/products/api/marketplaces';
  marketplaces: Marketplace [] = [];

  constructor(private http: HttpClient) { }

  getMarketplaces(): Observable<Marketplace[]> {
    return this.http.get<Marketplace[]>(`${this.URI}${this.URI_MARKETPLACE}`)
    .pipe(map( (marketplacesResp: Marketplace[]) => {
      this.marketplaces = marketplacesResp;
      return this.marketplaces;
    }));
  }

  saveProduct(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.post<Marketplace>(`${this.URI}${this.URI_MARKETPLACE}`, marketplace);
  }

  updateProduct(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.put<Marketplace>(`${this.URI}${this.URI_MARKETPLACE}/${marketplace.id}`, marketplace);
  }

  deleteProduct(id: number) {
   return  this.http.delete(`${this.URI}${this.URI_MARKETPLACE}/${id}`);
  }

}
