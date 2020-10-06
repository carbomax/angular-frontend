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
  URI_MARGIN = '/user/api/margins';
  margins: Margin [] = [];

  constructor(private http: HttpClient) { }

  getMargins(): Observable<Margin[]> {
    return this.http.get<Margin[]>(`${this.URI}${this.URI_MARGIN}/1`)
    .pipe(map( (marginResp: Margin[]) => {
      this.margins = marginResp;
      return this.margins;
    }));
  }

  saveMargin(margin: Margin, id: number): Observable<Margin> {
    return this.http.post<Margin>(`${this.URI}${this.URI_MARGIN}/${id}`, margin);
  }

  updateMargin(margin: Margin, idProfile: number): Observable<Margin> {
    return this.http.put<Margin>(`${this.URI}${this.URI_MARGIN}/${idProfile}/${margin.id}`, margin);
  }

  deleteMargin(id: number) {
   return  this.http.delete(`${this.URI}${this.URI_MARGIN}/${id}`);
  }

}
