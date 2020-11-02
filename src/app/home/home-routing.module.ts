import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { ProductsStoreComponent } from './pages/home/store/products-store/products-store.component';
import { ChooseMarketplacesComponent } from './pages/home/my-products/choose-marketplaces/choose-marketplaces.component';
import { PublishMyproductsComponent } from './pages/home/my-products/publish-myproducts/publish-myproducts.component';
import { ListMarketplacesComponent } from './pages/home/marketplaces/list-marketplaces/list-marketplaces.component';
import { PopupAddcommoninfoComponent } from './components/modals/popup-addcommoninfo/popup-addcommoninfo.component';
import { MeliCategoryPathComponent } from './pages/home/meli/meli-category-path/meli-category-path.component';
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
    path: '', component: HomeComponent, data: {title: 'Inicio'},
    children: [
      { path: 'store', component: ProductsStoreComponent, canActivate: [AuthGuard] ,data: {title: 'Almacén'} },
      { path: 'marketplaces', component: ChooseMarketplacesComponent, canActivate: [AuthGuard] ,data: {title: 'Mis productos'} },
      { path: 'publish-myproducts', component: PublishMyproductsComponent, canActivate: [AuthGuard] ,data: {title: 'Productos publicados'}},
      { path: 'list-marketplaces', component: ListMarketplacesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] , title: 'Marketplaces'} },
      { path: 'edit-myproducts/:id', component: EditProductsComponent, canActivate: [AuthGuard] ,data: {title: 'Inicio'}},
      { path: 'published-products', component: PublishedProductComponent, canActivate: [AuthGuard] ,data: {title: 'Inicio'}},
      { path: 'addcommoninfocomponent', component: PopupAddcommoninfoComponent, canActivate: [AuthGuard] ,data: {title: 'Inicio'}},
      { path: 'meli-category', component: MeliCategoryPathComponent, canActivate: [AuthGuard] ,data: {title: 'Inicio'}},
      { path: 'sellers', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] , title: 'Vendedores'} },
      { path: 'margins', component: ListMarginsComponent, canActivate: [AuthGuard] ,data: {title: 'Márgenes'}},
      { path: 'users-admin', component: UserAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] , title: 'Usuarios'} },
      { path: 'meli-accounts', component: MeliAccountsComponent, canActivate: [AuthGuard] ,data: {title: 'Cuentas mercado libre'}},
      { path: 'seller-orders', component: SellerOrdersComponent, canActivate: [AuthGuard] ,data: {title: 'Ordenes'}},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
