import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../models/user.model';
import { AuthenticationData } from '../models/authentication.data.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationData: AuthenticationData = new AuthenticationData();

  URI = environment.URI_ROOT;
  URI_AUTH = `${this.URI}/security/oauth/token`;

  app = {
    credential: 'pepeganga_app' + ':' + '12345'
  }

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa('pepeganga_app' + ':' + '12345')
  });



  constructor(public http: HttpClient) { }

  login(user: User): Observable<any> {
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.email);
    params.set('password', user.password);
    return this.http.post<any>(this.URI_AUTH, params.toString(), { headers: this.httpHeaders })
      .pipe(map((data: any) => {
        this.setTokenStorage(data);
        return this.authenticationDataExtrac();
      }));
  }

  logout(): void{
    this.authenticationData =  new AuthenticationData();
    this.clearLocalStorage();
  }


  setTokenStorage(data: any): void {
    localStorage.setItem('token', 'Bearer ' + data.access_token);
    const payload = this.jsonParseAtob(data.access_token.split('.')[1]);
    sessionStorage.setItem('email', payload.user_name);
    sessionStorage.setItem('email', payload.profileName);

  }

  getTokenStorage(): any {
    if (!localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.authenticationDataExtrac() != null;
  }

  clearLocalStorage(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('email');
  }

  public jsonParseAtob(data: any): any {
    return JSON.parse(atob(data));
  }

  authenticationDataExtrac(): AuthenticationData {
    if (!localStorage.getItem('token')) {
      return null;
    } else {
      const payload = this.jsonParseAtob(localStorage.getItem('token').split(' ')[1].split('.')[1]);
      this.authenticationData = new AuthenticationData();
      this.authenticationData.email = payload.user_name;
      this.authenticationData.exp = payload.exp;
      this.authenticationData.lastName = payload.lastName;
      this.authenticationData.roles = payload.authorities;
      this.authenticationData.profileName = payload.profileName;
      this.authenticationData.profileId = payload.profileId;
      this.authenticationData.scope = payload.scope;
      return this.authenticationData;
    }
  }

  hasRole(role: string): boolean {
    return this.authenticationDataExtrac().roles.includes(role);
  }

}
