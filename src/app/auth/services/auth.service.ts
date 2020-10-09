import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

login(user: User): Observable <any> {
  const params = new URLSearchParams();
  params.set('grant_type', 'password');
  params.set('username', user.email);
  params.set('password', user.password);
  console.log(params.toString())
  return this.http.post<any>(this.URI_AUTH, params.toString(), {headers: this.httpHeaders});
}


}
