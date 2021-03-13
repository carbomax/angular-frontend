import { NgModule } from '@angular/core';


import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';


//Components
import { SidebardComponent } from './components/sidebard/sidebard.component';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsStoreComponent } from './pages/home/store/products-store/products-store.component';
import { ChooseMarketplacesComponent } from './pages/home/my-products/choose-marketplaces/choose-marketplaces.component';
import { PublishMyproductsComponent } from './pages/home/my-products/publish-myproducts/publish-myproducts.component';
import { ListMarketplacesComponent } from './pages/home/marketplaces/list-marketplaces/list-marketplaces.component';


import { NotImagePipe } from './pipes/not-image.pipe';
import {MatDialogModule} from '@angular/material/dialog';


import { PopupAddcommoninfoComponent } from './components/modals/popup-addcommoninfo/popup-addcommoninfo.component';
import { EditProductsComponent } from './pages/home/my-products/edit-products/edit-products.component';
import { UsersComponent } from './pages/home/users/users.component';
import { NotImageProfilePipe } from './pipes/not-image-profile.pipe';
import { FilterProductsStoragePipe } from './pipes/filter-products-storage.pipe';
import { ListMarginsComponent } from './pages/home/list-margins/list-margins.component';
import { MarginTypesPipe } from './pipes/margin-types.pipe';
import { UserAdminComponent } from './pages/home/user-admin/user-admin.component';
import { MeliAccountsComponent } from './pages/home/meli-accounts/meli-accounts.component';
import { PublishedProductComponent } from './pages/home/my-products/published-product/published-product.component';
import { SellerOrdersComponent } from './pages/home/orders/seller-orders/seller-orders.component';
import { MeliCategoryPathComponent } from './pages/home/meli/meli-category-path/meli-category-path.component';
import { EditProductsPublishedComponent } from './pages/home/my-products/edit-products-published/edit-products-published.component';
import { OperationsComponent } from './pages/home/operations/operations.component';
import { AttributeRequiredComponent } from './components/modals/attribute-required/attribute-required.component';
import { HistorialOperationComponent } from './pages/home/historial-operation/historial-operation.component';
import { ChartLineOrdersComponent } from './pages/home/charts/chart-line-orders/chart-line-orders.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { DashboardAdminComponent } from './pages/home/dashboard/dashboard-admin/dashboard-admin.component';
import { DashboardSellerComponent } from './pages/home/dashboard/dashboard-seller/dashboard-seller.component';
import { TotalSalesComponent } from './pages/home/dashboard/components/total-sales/total-sales.component';
import { BetterSkuComponent } from './pages/home/dashboard/components/better-sku/better-sku.component';
import { StockVsTotalComponent } from './pages/home/dashboard/components/stock-vs-total/stock-vs-total.component';
import { ActivePublicationsComponent } from './pages/home/dashboard/components/active-publications/active-publications.component';
import { ChartLineOrdersSellersComponent } from './pages/home/charts/chart-line-orders-sellers/chart-line-orders-sellers.component';
import { UploadImagePipe } from './pipes/upload-image.pipe';
import { TablePaginatorInfoComponent } from './components/table-paginator-info/table-paginator-info.component';
import { UploadEditImagePipe } from './pipes/upload-edit-image.pipe';




@NgModule({
  declarations: [
    HomeComponent,
    SidebardComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    ProductsStoreComponent,
    FilterProductsStoragePipe,
    NotImagePipe,
    ChooseMarketplacesComponent,
    PublishMyproductsComponent,
    ListMarketplacesComponent,
    PopupAddcommoninfoComponent,
    EditProductsComponent,
    UsersComponent,
    NotImageProfilePipe,
    ListMarginsComponent,
    MarginTypesPipe,
    UserAdminComponent,
    MeliAccountsComponent,
    PublishedProductComponent,
    SellerOrdersComponent,
    MeliCategoryPathComponent,
    EditProductsPublishedComponent,
    OperationsComponent,
    AttributeRequiredComponent,
    HistorialOperationComponent,
    DashboardAdminComponent,
    ChartLineOrdersComponent,
    DashboardAdminComponent,
    DashboardComponent,
    DashboardSellerComponent,
    TotalSalesComponent,
    BetterSkuComponent,
    StockVsTotalComponent,
    ActivePublicationsComponent,
    ChartLineOrdersSellersComponent,
    UploadImagePipe,
    TablePaginatorInfoComponent,
    UploadEditImagePipe],

  exports: [HomeComponent,
    SidebardComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    ProductsStoreComponent,
    ChooseMarketplacesComponent,
    PublishMyproductsComponent,
    ListMarketplacesComponent,
    PopupAddcommoninfoComponent,
    PublishedProductComponent,
    UsersComponent,
    NotImagePipe,
    NotImageProfilePipe,
    EditProductsComponent,
    NotImagePipe,
    UploadEditImagePipe,
    ListMarginsComponent,
    SellerOrdersComponent,
    MeliCategoryPathComponent,
    EditProductsPublishedComponent,
    DashboardAdminComponent,
    DashboardComponent,
    TotalSalesComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
    MatDialogModule
  ]
})
export class HomeModule { }
