import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

/** Pass untouched request through to the next request handler. */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorHttpService implements HttpInterceptor {

  constructor(public authService: AuthService, public router: Router) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: localStorage.getItem('token')
        }
      });
    }
    return next.handle(req).pipe(
      catchError(e => {
        if (e.status === 401) {

          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['auth/login']);
        }

        if (e.status === 403) {
          Swal.fire('Acceso denegado', `Hola ${this.authService.authenticationDataExtrac().profileName} no tienes acceso a este recurso!`, 'warning');

          this.router.navigate(['/home']);
        }
        return throwError(e);
      })
    );
  }
}
