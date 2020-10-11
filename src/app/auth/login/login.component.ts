import { ErrorRequest } from './../../core/models/error.request.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

declare function initializePlugin();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;
  public badCredentials = false;
  public error500 = false;

  public loading = false;
  public loginIntoText = 'Entrar';


  alertMessaje = '<strong>Usuario</strong>  o <strong>clave</strong> incorrectas!';

  constructor(public router: Router, public authService: AuthService) {
    this.initialize();
  }

  ngOnInit(): void {
    initializePlugin();
    this.loginIntoText = 'Entrar';
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

  }

  login(): void {
    this.loginIntoText = '';
    this.loading = true;
    this.badCredentials = false;
    this.error500 = false;
    if (this.user.email !== '' && this.user.password !== '') {
      this.authService.login(this.user).subscribe(authData => {
        this.loading = true;
        console.log(authData);
        this.router.navigate(['/home']);
      }, (error: ErrorRequest) => {
        console.log(error);
        if (error.status === 400) {
          this.badCredentials = true;
        } else {
          this.error500 = true;
        }

        this.loginIntoText = 'Entrar';

        this.loading = false;
      })

    }
  }

  initialize(): void {
    this.user = new User();
  }

}
