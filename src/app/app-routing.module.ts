import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
    import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'home', canActivate: [AuthGuard],
    loadChildren: () =>
    import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: '**', redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
