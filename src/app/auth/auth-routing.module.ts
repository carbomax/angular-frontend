import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'login', component: LoginComponent
        },
        {
          path: 'forgot', component: ForgotPasswordComponent
        }    ,
        {
          path: 'reset', component: ResetPasswordComponent
        },
        { path: '**', redirectTo: 'login'}
      ]
    }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
