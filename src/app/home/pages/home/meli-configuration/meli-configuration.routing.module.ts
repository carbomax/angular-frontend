import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SystemConfigurationComponent } from './pages/system-configuration/system-configuration.component';
import { AuthGuard } from 'src/app/auth/guard/auth.guard';
import { RoleEnum } from 'src/app/enums/role.enum';
import { ConfigureCategoriesComponent } from './pages/configure-categories/configure-categories.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'system-config-admin',
        component: SystemConfigurationComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [RoleEnum.ADMIN],
            title: 'Configuraciones del sistema'
        },
      },
      { path: 'configure-categories', component: ConfigureCategoriesComponent, canActivate: [AuthGuard] , data: { roles: [RoleEnum.ADMIN], title: 'ConfigurarCategorias' }},
      { path: '**', redirectTo: 'system-config-admin'}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeliConfigurationRoutingModule {}
