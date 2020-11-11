import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Services
import { AuthService } from '../../core/services/auth.service';
import { MeliAccount } from '../../models/meli.account';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MeliAccountService {


  URI_MELI_BUSINESS = `${environment.URI_ROOT}/meli/api/accounts`;
  URI_MELI_API = `${environment.URI_ROOT}/meli/api/auth`;
  profileId: number;

  meliAccounts: MeliAccount [] = [];

  constructor(public authService: AuthService, public http: HttpClient) {

   }

  public redirectToMeli(id: number): void {
    this.saveAccountStorage(id);
    window.open(environment.URI_MELI, '_parent');
  }

  public getAccounts(): Observable<MeliAccount[]> {
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    return this.http.get<MeliAccount[]>(`${this.URI_MELI_BUSINESS}/by-profile/${this.profileId}`)
    .pipe(
      map( (resp: any) => {
        this.meliAccounts = resp;
        return this.meliAccounts;
      })
    );
  }

  public updateAccount(account: MeliAccount): Observable<MeliAccount>{
    return this.http.put<MeliAccount>(`${this.URI_MELI_BUSINESS}/update/${account.id}`, account);
  }

  public saveAccountByProfile(account: MeliAccount): Observable<MeliAccount> {
    return this.http.post<MeliAccount>(`${this.URI_MELI_BUSINESS}/${this.profileId}`, account);
  }

  public deleteAccount(id: number) {
    return this.http.delete(`${this.URI_MELI_BUSINESS}/${id}`);
  }

  public authorizeAccount(id: number, code: any): Observable<any>{
    return this.http.get<any>(`${this.URI_MELI_API}/${id}/${code}`);
  }


  synchronizeAccount(id): Observable<any> {
    return this.http.get<any>(`${this.URI_MELI_API}/synchronize-account/${id}`);
  }

  public getUrlMeli(): string{
    return environment.URI_MELI;
  }

  saveAccountStorage(id: number): void{
    localStorage.removeItem('reference');
    localStorage.setItem('reference', JSON.stringify(id));
  }

  clearAccountStorage(): void {
    localStorage.removeItem('reference');
  }

  getAccountStorageReference(): number {
    return +localStorage.getItem('reference').trim();
  }



  getAccountReference(): string{
    return localStorage.getItem('reference');
  }

  private mask(value: number): string {
    const firts = Math.random();
    const second = Math.random();
    return  firts + ' ' + (value * firts) / second + ' ' + second;
  }



   // getAccountStorageReference(): number {
  //   const reference = localStorage.getItem('reference').split(' ');
  //   if(reference){
  //     return Math.floor((+reference[1] * +reference[2]) / +reference[0]);
  //   } else{
  //     console.log('Reference to account lost', reference);
  //     return null;
  //   }

  // }
}
