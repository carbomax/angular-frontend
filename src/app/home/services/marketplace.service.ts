import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Marketplace } from '../../models/marketplace.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  URI = environment.URI_ROOT;
  URI_MARKETPLACE = '/products/api/marketplaces';
  marketplaces: Marketplace [] = [];

  constructor(private http: HttpClient) { }

  getMarketplaces(): Observable<Marketplace[]> {
    return this.http.get<Marketplace[]>(`${this.URI}${this.URI_MARKETPLACE}`);
  }

  saveProduct(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.post<Marketplace>(`${this.URI}${this.URI_MARKETPLACE}`, marketplace);
  }

  updateProduct(marketplace: Marketplace): Observable<Marketplace> {
    return this.http.put<Marketplace>(`${this.URI}${this.URI_MARKETPLACE}/${marketplace.id}`, marketplace);
  }

  deleteProduct(id: number): Observable<Marketplace> {
    return this.http.delete<Marketplace>(`${this.URI}${this.URI_MARKETPLACE}/${id}`);
  }
}
