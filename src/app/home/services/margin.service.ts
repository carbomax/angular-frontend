import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Margin } from '../../models/margin';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarginService {

  URI = environment.URI_ROOT;
  URI_MARGIN = '/products/api/margins';
  margins: Margin [] = [];

  constructor(private http: HttpClient) { }

  getMargins(): Observable<Margin[]> {
    return this.http.get<Margin[]>(`${this.URI}${this.URI_MARGIN}`)
    .pipe(map( (marginResp: Margin[]) => {
      this.margins = marginResp;
      return this.margins;
    }));
  }

  saveMargin(margin: Margin): Observable<Margin> {
    return this.http.post<Margin>(`${this.URI}${this.URI_MARGIN}`, margin);
  }

  updateMargin(margin: Margin): Observable<Margin> {
    return this.http.put<Margin>(`${this.URI}${this.URI_MARGIN}/${margin.id}`, margin);
  }

  deleteMargin(id: number) {
   return  this.http.delete(`${this.URI}${this.URI_MARGIN}/${id}`);
  }

}
