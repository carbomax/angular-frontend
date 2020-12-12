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

  constructor(public resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
    initializePlugin();

   this.initReactiveForm();

  }

  sendEmail(): void {
    console.log(this.forgotForm.get('email').value);
    const email = this.forgotForm.get('email').value;
    this.resetPasswordService.sendEmailToResetPassword(email, this.url)
    .subscribe(resp => {
      console.log(resp);
    }, error => {
      console.log(error);
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
