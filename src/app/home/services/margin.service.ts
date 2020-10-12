import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Margin } from '../../models/margin';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthenticationData } from '../../core/models/authentication.data.models';

@Injectable({
  providedIn: 'root'
})
export class MarginService {

  URI = environment.URI_ROOT;
  URI_MARGIN = '/user/api/margins';
  margins: Margin [] = [];
  authenticationData: AuthenticationData = new AuthenticationData();
  profileId: number;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    console.log(this.profileId)
   }

  getMargins(): Observable<Margin[]> {
    console.log(this.profileId)
    return this.http.get<Margin[]>(`${this.URI}${this.URI_MARGIN}/${this.profileId}`)
    .pipe(map( (marginResp: Margin[]) => {
      this.margins = marginResp;
      return this.margins;
    }));
  }

  saveMargin(margin: Margin): Observable<Margin> {
    return this.http.post<Margin>(`${this.URI}${this.URI_MARGIN}/${this.profileId}`, margin);
  }

  updateMargin(margin: Margin): Observable<Margin> {
    return this.http.put<Margin>(`${this.URI}${this.URI_MARGIN}/${this.profileId}/${margin.id}`, margin);
  }

  deleteMargin(id: number) {
   return  this.http.delete(`${this.URI}${this.URI_MARGIN}/${id}`);
  }

}
