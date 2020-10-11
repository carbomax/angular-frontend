import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { ProductsStoreComponent } from './pages/home/store/products-store/products-store.component';
import { ChooseMarketplacesComponent } from './pages/home/my-products/choose-marketplaces/choose-marketplaces.component';
import { PublishMyproductsComponent } from './pages/home/my-products/publish-myproducts/publish-myproducts.component';
import { ListMarketplacesComponent } from './pages/home/marketplaces/list-marketplaces/list-marketplaces.component';
import { PopupAddcommoninfoComponent } from './components/modals/popup-addcommoninfo/popup-addcommoninfo.component';
import { UsersComponent } from './pages/home/users/users.component';

import { EditProductsComponent } from './pages/home/my-products/edit-products/edit-products.component';
import { ListMarginsComponent } from './pages/home/list-margins/list-margins.component';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { RoleEnum } from '../enums/role.enum';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'store', component: ProductsStoreComponent, canActivate: [AuthGuard]},
      { path: 'marketplaces', component: ChooseMarketplacesComponent , canActivate: [AuthGuard]},
      { path: 'publish-myproducts', component: PublishMyproductsComponent, canActivate: [AuthGuard]},
      { path: 'list-marketplaces', component: ListMarketplacesComponent , canActivate: [AuthGuard, RoleGuard], data: {role: RoleEnum.ADMIN} },
      { path: 'marketplaces', component: ChooseMarketplacesComponent, canActivate: [AuthGuard]},
      { path: 'publish-myproducts', component: PublishMyproductsComponent , canActivate: [AuthGuard]},
      { path: 'edit-myproducts', component: EditProductsComponent , canActivate: [AuthGuard]},
      { path: 'addcommoninfocomponent', component: PopupAddcommoninfoComponent , canActivate: [AuthGuard]},
      { path: 'users', component: UsersComponent , canActivate: [AuthGuard]},
      { path: 'margins', component: ListMarginsComponent , canActivate: [AuthGuard]},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
