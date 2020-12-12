import { ResetPasswordService } from './../../core/services/reset-password.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ErrorRequest } from '../../core/models/error.request.model';

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



  alertMessaje = '<strong>Usuario</strong>  o <strong>clave</strong> incorrectas!';

  public formSubmitted = false;

public registerForm: FormGroup;
  constructor(public router: Router, public activateRouter: ActivatedRoute,
              public authService: AuthService, public resetPasswordService: ResetPasswordService) {
    this.initialize();
    this.activateRouter.queryParamMap.subscribe(( resp: any) =>
      {
        if(resp.params.token){
          console.log('vienen parametros')
          this.resetPasswordService.isValidToken(resp.params.token)
              .subscribe( resp => {
                console.log(resp);
                if(resp.valueOf()){

                  console.log('Token valid')
                } else{
                  // valid
                }
              })

        } else console.log('no vienen parametros')
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

  resetPassword(){}

  initialize(): void {
    this.user = new User();
  }

  fieldNotValid(field: string): boolean {
    return (this.registerForm.get(field).invalid
    && (this.registerForm.get(field).dirty || this.registerForm.get(field).touched)) ? true : false;
   }

  get email() { return this.registerForm.get('email'); }
  get password () { return this.registerForm.get('password'); }
  get remember () { return this.registerForm.get('remember'); }


}
