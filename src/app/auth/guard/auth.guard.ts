import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, DefaultUrlSerializer } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isAuthenticated()) {
      if (this.isTokenExpirated()) {
        this.authService.logout();
        this.router.navigate(['auth/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

  isTokenExpirated(): boolean {
    const exp = this.authService.authenticationDataExtrac().exp;
    const timeNow = new Date().getTime() / 1000;
    console.log('Timepo EXP', exp)
    console.log('Tiempo now', timeNow)

    return +exp < +timeNow;
  }

}
