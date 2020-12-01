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
import { EditProductsPublishedComponent } from './pages/home/my-products/edit-products-published/edit-products-published.component';
import { PublishedProductComponent } from './pages/home/my-products/published-product/published-product.component';
import { ListMarginsComponent } from './pages/home/list-margins/list-margins.component';
import { UserAdminComponent } from './pages/home/user-admin/user-admin.component';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { RoleEnum } from '../enums/role.enum';
import { MeliAccountsComponent } from './pages/home/meli-accounts/meli-accounts.component';
import { SellerOrdersComponent } from './pages/home/orders/seller-orders/seller-orders.component';
import { OperationsComponent } from './pages/home/operations/operations.component';
import { HistorialOperationComponent } from './pages/home/historial-operation/historial-operation.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: HomeComponent, data: {title: 'Inicio'},
    children: [
      { path: 'store', component: ProductsStoreComponent, canActivate: [AuthGuard] , data: {title: 'Productos-Almacén'}},
      { path: 'marketplaces', component: ChooseMarketplacesComponent, canActivate: [AuthGuard] ,  data: {title: 'Marketplaces'}},
      { path: 'publish-myproducts', component: PublishMyproductsComponent, canActivate: [AuthGuard],  data: {title: 'Mis productos'} },
      { path: 'list-marketplaces', component: ListMarketplacesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] , title: 'Marketplaces'} , },
      { path: 'edit-myproducts/:id', component: EditProductsComponent, canActivate: [AuthGuard], data: {title: 'Detalles de productos'} },
      { path: 'edit-products-published/:id', component: EditProductsPublishedComponent, canActivate: [AuthGuard], data: {title: 'Detalles de publicaciones'} },
      { path: 'published-products', component: PublishedProductComponent, canActivate: [AuthGuard] , data: {title: 'Productos publicados'}},
      { path: 'addcommoninfocomponent', component: PopupAddcommoninfoComponent, canActivate: [AuthGuard] },
      { path: 'meli-category', component: MeliCategoryPathComponent, canActivate: [AuthGuard] },
      { path: 'sellers', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN], title: 'Vendedores' } },
      { path: 'margins', component: ListMarginsComponent, canActivate: [AuthGuard] , data: {title: 'Márgenes'}},
      { path: 'users-admin', component: UserAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [RoleEnum.ADMIN] , title: 'Usuarios'} },
      { path: 'meli-accounts', component: MeliAccountsComponent, canActivate: [AuthGuard], data: { roles: [RoleEnum.ADMIN, RoleEnum.SELLER], title: 'Cuentas Mercado Libre' } },
      { path: 'seller-orders', component: SellerOrdersComponent, canActivate: [AuthGuard] , data: { roles: [RoleEnum.ADMIN, RoleEnum.SELLER], title: 'Órdenes' }},
      { path: 'operations', component: OperationsComponent, canActivate: [AuthGuard] , data: { roles: [RoleEnum.ADMIN, RoleEnum.OPERATOR], title: 'Operaciones' }},
      { path: 'historial-operations', component: HistorialOperationComponent, canActivate: [AuthGuard] , data: { roles: [RoleEnum.ADMIN, RoleEnum.OPERATOR], title: 'Historico-Operaciones' }},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
