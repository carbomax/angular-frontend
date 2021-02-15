import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileComponent } from './pages/account-profile/account-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemConfigurationComponent } from './pages/system-configuration/system-configuration.component';
import { MeliConfigurationRoutingModule } from './meli-configuration.routing.module';
import { EnableDisableFlexByAccountsComponent } from './pages/enable-disable-flex-by-accounts/enable-disable-flex-by-accounts.component';



@NgModule({
  declarations: [
    AccountProfileComponent,
    SystemConfigurationComponent,
    EnableDisableFlexByAccountsComponent
  ],  

  exports: [
    AccountProfileComponent,
    SystemConfigurationComponent
  ],

  imports: [
    CommonModule,
    MeliConfigurationRoutingModule,
    SharedModule
  ]
  
})
export class MeliConfigurationModule { }
