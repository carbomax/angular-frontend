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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'store', component: ProductsStoreComponent },
      { path: 'marketplaces', component: ChooseMarketplacesComponent },
      { path: 'publish-myproducts', component: PublishMyproductsComponent },
      { path: 'list-marketplaces', component: ListMarketplacesComponent },
      { path: 'marketplaces', component: ChooseMarketplacesComponent},
      { path: 'publish-myproducts', component: PublishMyproductsComponent },
      { path: 'edit-myproducts', component: EditProductsComponent },
      { path: 'addcommoninfocomponent', component: PopupAddcommoninfoComponent },
      { path: 'users', component: UsersComponent },
      { path: 'margins', component: ListMarginsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
