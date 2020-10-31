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
import { PublishedProductComponent } from './pages/home/my-products/published-product/published-product.component';
import { ListMarginsComponent } from './pages/home/list-margins/list-margins.component';
import { UserAdminComponent } from './pages/home/user-admin/user-admin.component';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { RoleEnum } from '../enums/role.enum';
import { MeliAccountsComponent } from './pages/home/meli-accounts/meli-accounts.component';
import { SellerOrdersComponent } from './pages/home/orders/seller-orders/seller-orders.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'store', component: ProductsStoreComponent, canActivate: [AuthGuard] },
      { path: 'marketplaces', component: ChooseMarketplacesComponent, canActivate: [AuthGuard] },
      { path: 'publish-myproducts', component: PublishMyproductsComponent, canActivate: [AuthGuard] },
      { path: 'list-marketplaces', component: ListMarketplacesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] } },
      { path: 'edit-myproducts/:id', component: EditProductsComponent, canActivate: [AuthGuard] },
      { path: 'published-products', component: PublishedProductComponent, canActivate: [AuthGuard] },
      { path: 'addcommoninfocomponent', component: PopupAddcommoninfoComponent, canActivate: [AuthGuard] },
      { path: 'sellers', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] } },
      { path: 'margins', component: ListMarginsComponent, canActivate: [AuthGuard] },
      { path: 'users-admin', component: UserAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] } },
      { path: 'meli-accounts', component: MeliAccountsComponent, canActivate: [AuthGuard] },
      { path: 'seller-orders', component: SellerOrdersComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
