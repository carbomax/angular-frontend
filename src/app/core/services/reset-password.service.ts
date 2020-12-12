import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  URI = environment.URI_ROOT;
  URL_USER = `${this.URI}/user`;

  constructor(private http: HttpClient) { }

  sendEmailToResetPassword(email: string, url: string){
    console.log('paso x el service')
    return this.http.post( `${this.URL_USER}/reset/send/email-reset-password?email=${email}&url=${url}`, {});
  }

  isValidToken(token: string): Observable<Boolean>{
    return this.http.get<Boolean>( `${this.URL_USER}/reset/valid-token-by-reset-password?token=${token}`);
  }

}
