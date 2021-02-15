import { ErrorRequest } from './../../core/models/error.request.model';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  public formSubmitted = false;

public registerForm: FormGroup;
  constructor(public router: Router, public authService: AuthService, private fb: FormBuilder) {
    this.initialize();
  }


  fieldNotValid(field: string): boolean {
   return (this.registerForm.get(field).invalid
   && (this.registerForm.get(field).dirty || this.registerForm.get(field).touched)) ? true : false;
  }

  ngOnInit(): void {
    initializePlugin();
    this.registerForm = new FormGroup({
      email: new FormControl(localStorage.getItem('rememberEmail') || '', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      remember: new FormControl(false)
    });


    this.loginIntoText = 'Entrar';
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']);
    }

  }


  login(): void {
    this.loginIntoText = '';
    this.loading = true;
    this.badCredentials = false;
    this.error500 = false;
    if (this.user.email !== '' && this.user.password !== '') {
      console.log('REMEMBER', this.remember.value)
      if(this.remember.value) {
        localStorage.setItem('rememberEmail', this.email.value as string)
      } else {
        localStorage.removeItem('rememberEmail')
      }
      this.user.email = this.email.value;
      this.user.password = this.password.value;
      this.authService.login(this.user).subscribe(authData => {
        this.loading = true;
        console.log(authData);
        this.router.navigate(['/home']);
      }, (error: ErrorRequest) => {
        console.log('Login Error: ', error);
        if (error.status === 400 || error.status === 404 || error.status === 401) {
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

  get email() { return this.registerForm.get('email'); }
  get password () { return this.registerForm.get('password'); }
  get remember () { return this.registerForm.get('remember'); }

}
