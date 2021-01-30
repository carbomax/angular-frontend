import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { MeliConfigurationRoutingModule } from './meli-configuration.routing.module';



@NgModule({
  declarations: [
    AccountProfileComponent,
    SystemConfigurationComponent
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
