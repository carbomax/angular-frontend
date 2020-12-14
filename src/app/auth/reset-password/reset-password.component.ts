import { ResetPasswordService } from './../../core/services/reset-password.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

declare function initializePlugin();

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public user: User;
  public badCredentials = false;
  public error500 = false;

  public loading = false;
  public loginIntoText = 'Entrar';

  public userEnabled = true;

  public resultChangePassword = '';



  alertMessaje = '<strong>Usuario</strong>  o <strong>clave</strong> incorrectas!';

  public formSubmitted = false;

  public registerForm: FormGroup;
  constructor(public router: Router, public activateRouter: ActivatedRoute,
    public authService: AuthService, public resetPasswordService: ResetPasswordService) {
    this.initialize();
    this.activateRouter.queryParamMap.subscribe((resp: any) => {
      this.userEnabled = true;
      if (resp.params.token) {
        console.log('vienen parametros')
        console.log('save local storage')
        if (localStorage.getItem('resetToken')) {
          localStorage.removeItem('resetItem');
        }
        localStorage.setItem('resetToken', resp.params.token);
        this.resetPasswordService.isValidToken(resp.params.token)
          .subscribe(resp => {
            console.log(resp);
            if (resp.valueOf()) {
              console.log('Token valid')
              // validar si no ha sido deshabilitado del sistema
              this.resetPasswordService.isUserEnabledByToken(localStorage.getItem('resetToken'))
                .subscribe(resp => {
                  this.userEnabled = resp.valueOf();
                  if (this.userEnabled) {
                    console.log('User enabled', this.userEnabled)
                  } else {
                    console.log('User not enabled', this.userEnabled)
                  }
                }, error => {
                  console.log(error);
                  this.router.navigate(['auth/login']);
                })
            } else {
              // valid
              console.log('Token invalid')
              this.router.navigate(['auth/login']);
            }
          }, error => {
            console.log(error);
            this.router.navigate(['auth/login']);
          })

      } else {
        console.log('no vienen parametros')
        this.router.navigate(['auth/login']);
      }
    })
  }

  changePassword() {
    this.resetPasswordService.changePassword(localStorage.getItem('resetToken'), this.registerForm.get('password').value)
      .subscribe((resp: any) => {
        console.log(resp)
        if (resp.passwordChanged) {
          this.resultChangePassword = 'passwordChanged';
         this.notificationChangePassword('Su contraseña ha sido cambiada satisfactoriamente', 'success');
        }
        if (resp.userNotEnabled) {
          this.userEnabled = false;
          return;
        }

        if (resp.userNotFound) {
          this.notificationChangePassword('Su usuario no fue encontrado en el sistema, consulte al administrador', 'info');
        }

        if (resp.invalidToken) {
          this.notificationChangePassword('Su tiempo para cambiar la contraseña ha expirado!', 'warning');
        }

      })
  }


  notificationChangePassword(message, icon){
    Swal.fire({
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2000
    }).then( (result) => {
      this.router.navigate(['auth/login']);
    })
  }
  ngOnInit(): void {
    initializePlugin();
    this.registerForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      remember: new FormControl(false)
    });


    this.loginIntoText = 'Entrar';
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

  }

  resetPassword() {
    this.changePassword();
  }

  initialize(): void {
    this.user = new User();
  }

  fieldNotValid(field: string): boolean {
    return (this.registerForm.get(field).invalid
      && (this.registerForm.get(field).dirty || this.registerForm.get(field).touched)) ? true : false;
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get remember() { return this.registerForm.get('remember'); }


}
