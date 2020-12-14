import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../core/services/reset-password.service';

declare function initializePlugin();

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotForm: FormGroup;

  public url = `${environment.URI_RESET_PASS}`

  public sendEmailResponse = '';

  constructor(public resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
    initializePlugin();

   this.initReactiveForm();

  }

  sendEmail(): void {
    this.sendEmailResponse = '';
    console.log(this.forgotForm.get('email').value);
    const email = this.forgotForm.get('email').value;
    this.resetPasswordService.sendEmailToResetPassword(email, this.url)
    .subscribe((resp: any) => {
      console.log(resp)
      if(resp.sent){
        this.sendEmailResponse = 'sent';
        return;
      }
      if(resp.userNotFound){
        this.sendEmailResponse = 'userNotFound';
        return;
      }

      if(resp.userNotEnabled){
        this.sendEmailResponse = 'userNotEnabled';
        return;
      }
      if(resp.tokenNotSaved){
        this.sendEmailResponse = 'tokenNotSaved';
        return;
      }
      if(resp.error){
        this.sendEmailResponse = 'error';
        return;
      }

    }, error => {
      console.log(error);
      this.sendEmailResponse = 'error';
    })
  }

  initReactiveForm(): void {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    })
  }

}
