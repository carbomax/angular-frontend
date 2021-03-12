import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileComponent } from './pages/account-profile/account-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemConfigurationComponent } from './pages/system-configuration/system-configuration.component';
import { MeliConfigurationRoutingModule } from './meli-configuration.routing.module';
import { EnableDisableFlexByAccountsComponent } from './pages/enable-disable-flex-by-accounts/enable-disable-flex-by-accounts.component';
import { ConfigureCategoriesComponent } from './pages/configure-categories/configure-categories.component';
import { CategoriesWithoutMe2Component } from './pages/categories-without-me2/categories-without-me2.component';



@NgModule({
  declarations: [
    AccountProfileComponent,
    SystemConfigurationComponent,
    EnableDisableFlexByAccountsComponent,
    ConfigureCategoriesComponent,
    CategoriesWithoutMe2Component
  ],

  exports: [
    AccountProfileComponent,
    SystemConfigurationComponent,
    ConfigureCategoriesComponent,
    CategoriesWithoutMe2Component
  ],

  imports: [
    CommonModule,
    MeliConfigurationRoutingModule,
    SharedModule
  ]

})
export class MeliConfigurationModule { }
