import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsStorageService } from '../../../../services/products-storage.service';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MeliAccount } from 'src/app/models/meli.account';
import { ProductStore } from '../../../../../models/product.store';
import { ProductsMeliPublishedService } from '../../../../services/products.meli.published.service';
import { ProductMeliPublished, PageProductMeliPublished } from '../../../../../models/meli-publication/product-meli-published.model';
import { ChangeStatusPublicationType } from '../../../../../enums/change-status-publication-type';
import { StatesOfMeli } from 'src/app/enums/states-of-meli.enum';
import { MarketplaceType } from 'src/app/enums/marketplacetype.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-published-product',
  templateUrl: './published-product.component.html',
  styleUrls: ['./published-product.component.css']
})
export class PublishedProductComponent implements OnInit {

  @ViewChild('checkAllP') checkAllP;
  meliAccountSearchClear = '';
  typeStateSearchClear = '';
  disable = true;

  public loading = true;
  public loadPaginator = false;
  public loadingClear = false;
  public loadingSearch = false;
  public emptySearch = false;


  public idMeliSearch = '';
  public skuSearch = '';
  public meliAccountSearch = '';
  public typeStateSearch = '';
  public errorProducts = false;

  // Paginator

  page = 1;
  size = 15;
  checkAll = false;
  public changeStatusPublishType: ChangeStatusPublicationType;

  productsSelected: ProductMeliPublished[];
  meliAccountsList: MeliAccount[];

  //Loading Modal
  loadingModal = false;
  productsMeliPublished: ProductMeliPublished[] = [];
  pagePublised = new PageProductMeliPublished();
  constructor(private router: Router, public productsMeliPublishedService: ProductsMeliPublishedService, public meliAccountService: MeliAccountService) {
    this.loadProductsPaginator(true);
  }

  ngOnInit(): void {
    this.getAccountMeli();
    this.productsSelected = [];
  }

  selectChangeHandler(size): void {
    this.size = +size;
    this.loadProductsPaginator(true);
  }

  loadProductByPage(page): void {
    this.page = page;
    this.loadProductsPaginator(true);
  }

  loadProductsPaginator(onLoading: boolean): void {
    this.loading = onLoading;
    console.log('page', this.page)
    this.productsMeliPublishedService.
      getProductsPublished(this.page - 1, this.size, this.skuSearch, this.idMeliSearch, this.meliAccountSearch === '' ? -1 : +this.meliAccountSearch,
          this.typeStateSearch === '' ? '' : this.typeStateSearch).subscribe((resp: PageProductMeliPublished) => {

        if (this.loadingSearch && resp.numberOfElements === 0) {
          this.emptySearch = true;
          this.errorProducts = false;
        } else {
          this.emptySearch = false;
          this.loadingSearch = false;
        }
/*
        if((this.skuSearch !== '' || this.idMeliSearch !== '' || this.meliAccountSearch !== ''
            || this.typeStateSearch !== '') && resp.numberOfElements === 0){
              this.emptySearch = true;
            }
*/
        if((this.skuSearch === '' && this.idMeliSearch === '' && this.meliAccountSearch === ''
        && this.typeStateSearch === '') && resp.numberOfElements === 0){
          this.errorProducts = true;
          this.emptySearch = false;
        }

        this.pagePublised = resp;
        this.productsMeliPublished = this.pagePublised.content;
        this.loading = false;
        this.loadingClear = false;
        this.loadPaginator = false;

        let countSelected = 0;
        this.pagePublised.content.forEach(element => {
          this.productsSelected.forEach(select => {
            if (element.id === select.id) {
              element.selected = true;
              countSelected++;
            }
          });
        });
        if (countSelected === this.size) {
          this.checkAll = true;
          this.checkAllP.nativeElement.checked = 1;
        }
        else {
          this.checkAll = false;
          this.checkAllP.nativeElement.checked = 0;
        }
      }, (error: any) => {
        this.errorProducts = true;
        this.loadingClear = false;
        this.loadPaginator = false;
        this.emptySearch = false;
        this.loading = false;
      });

  }

  searchProductsPublished() {
      this.loadPaginator = true;
      this.loadingSearch = true;
      this.loadProductsPaginator(false);
  }

  // Clear search form
  clearSearch(f: NgForm): void {

    this.loadingClear = true;
    this.idMeliSearch = '';
    this.skuSearch = '';
    this.meliAccountSearch = '';
    this.typeStateSearch = '';
    this.loadProductsPaginator(false);
  }

  public get statesOfMeli(): typeof StatesOfMeli {
    return StatesOfMeli;
  }

  getAccountMeli(){
    this.meliAccountsList = [];
    this.meliAccountService.getAccounts().subscribe(resp => {
      resp.forEach(element => {
        if(element.marketplaceId === MarketplaceType.MERCADOLIBRE){
          this.meliAccountsList.push(element);
        }
      });
    })
  }

  selectAllProducts(): void {
    this.checkAll = !this.checkAll;

    this.pagePublised.content.forEach(element => {
      element.selected = this.checkAll;
      if (element.selected === true) {
        let position1 = -1;
        this.productsSelected.forEach(pro => { if (pro.id === element.id) { position1 = this.productsSelected.indexOf(pro); } });
        if (position1 === -1) {
          this.productsSelected.push(element);
        }
      }
      else {
        for( var i = 0; i < this.productsSelected.length; i++) {
          if ( this.productsSelected[i].id === element.id) {
            this.productsSelected.splice(i, 1);
            i--;
          }
        }
      }
    });
    if (this.productsSelected.length === 0) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  selectProduct(product: ProductMeliPublished): void {
    let position = -1;
    this.productsSelected.forEach(pro => { if (pro.id === product.id) { position = this.productsSelected.indexOf(pro); } });
    if (position === -1) {
      product.selected = !product.selected;
      if (product.selected === true) {
        this.productsSelected.push(product);
      }
    }
    else {
      product.selected = !product.selected;
      if (product.selected === false) {
        this.productsSelected.splice(position, 1);
      }
    }
    if (this.productsSelected.length === 0) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  deselectCheckedProducts(){
    this.pagePublised.content.forEach(element => {
      if (element.selected) {
        element.selected = false;
      }
    });
    this.productsSelected = [];
    this.disable = true;
  }
/*
  navegateToEdit(product: ProductMeliPublished) {
    let prod = JSON.stringify(product);
    this.router.navigate(['edit-products-published', prod]);
  }*/

  navegateToEdit(product: ProductMeliPublished) {
    this.router.navigate(['edit-products-published', product.id]);
  }

  cipherContent(content: string) {
    let encodeContent = btoa(content);
    let piece = Math.trunc(encodeContent.length / 3);
    let truck = content.substring(piece, piece * 2) + content.substring(0, piece) + content.substring(piece * 2);
    return truck;
  }


  // Change status publications

  changeStatusPublication(product: ProductMeliPublished, status: number): void {

    Swal.fire({
      title: 'Está seguro?',
      text: 'Confirme la operación!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {

        this.loading = true;
        this.productsMeliPublishedService.changeStatusPublication(product.accountMeli, status, product.idPublicationMeli)
          .subscribe((resp: any) => {

            this.loadProductsPaginator(true);
            if (resp.response) {
              this.notificationSuccessChangeStatus(resp.response);
            } else {
              this.notificationErrorChangeStatus(resp);
            }


          }, (error: any) => {
            console.log(error);
            this.notificationErrorChangeStatus(error);
          })

      }
    })
  }

  changeStatusMultiplePublications(status: number): void {
    /* Validacion de estados*/
    let isCorrect = true;
    switch(status){
       case 3: {
        this.productsSelected.forEach(prod => {
          if(prod.status !== 'active'){
            Swal.fire({
              title: 'Parámetros no válidos?',
              text: 'Para pausar las publicaciones seleccionadas estas deben estar en estado "activo"',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido'
            }) ;
            isCorrect = false;
            return;
          }
        });
          break;
      }
       case 4: {
        this.productsSelected.forEach(prod => {
          if(prod.status !== 'paused'){
            Swal.fire({
              title: 'Parámetros no válidos?',
              text: 'Para reactivar las publicaciones seleccionadas estas deben estar en estado "pausado"',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido'
            }) ;
            isCorrect = false;
            return;
          }
        });
         break;
       }
       case 5: {
        this.productsSelected.forEach(prod => {
          if(prod.status === 'closed' || prod.status === 'fail'){
            Swal.fire({
              title: 'Parámetros no válidos?',
              text: 'Para finalizar las publicaciones seleccionadas estas no deben estar en los estados "fallado" y "cerrado"',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido'
            }) ;
            isCorrect = false;
            return;
          }
        });
          break;
       }
    }

    if(isCorrect){
      Swal.fire({
        title: 'Está seguro?',
        text: 'Confirme la operación!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',

      }).then((result) => {
        if (result.isConfirmed) {

          this.loading = true;
          this.productsMeliPublishedService.changeStatusMultiplePublications(this.productsSelected, status)
            .subscribe((resp: any) => {
              let withError = false;
              this.loadProductsPaginator(true);
              if (!resp.response) {
                withError = true;
              }

            if(withError){
              this.notificationErrorChangeMultipleStatus(resp);
            }
            else{
              this.notificationSuccessChangeStatus(resp.response);
              this.deselectCheckedProducts();
            }

            }, (error: any) => {
              console.log(error);
              this.notificationErrorChangeMultipleStatus(error);
            })

        }
      })
    }
  }

  republishMultiplePublications(): void {
    /* Validacion de estados*/
    let isCorrect = true;
    let allClosed = true;
    let allTitle = true;

    this.productsSelected.forEach(prod => {
      if(prod.status !== 'closed'){
        allClosed = false;
        isCorrect = false;
      }
      else if(prod.title.length > 60){
          isCorrect = false;
          allTitle = false;
        }
    });

    if(!allClosed){
      Swal.fire({
        title: 'Parámetros no válidos?',
        text: 'Para republicar las publicaciones seleccionadas todas deben estar en estado "cerrado"',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      }) ;
    }

    if(!allTitle){
      Swal.fire({
        position: 'top-end',
        title: 'Título o Nombre del producto no válido',
        text: 'No se permite publicar produtos con título mayor de 60 caracteres',
        icon: 'info',
        showConfirmButton: false,
        timer: 5000
      })
    }

    if(isCorrect){
      Swal.fire({
        title: 'Está seguro?',
        text: 'Confirme la operación!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

          this.loading = true;
          this.productsMeliPublishedService.republishMultiplePublication(this.productsSelected)
            .subscribe((resp: any) => {
              let withError = false;
              this.loadProductsPaginator(true);
              if (!resp.response) {
                withError = true;
              }

            if(withError){
              this.notificationErrorChangeMultipleStatus(resp);
            }
            else{
              this.notificationSuccessChangeStatus(resp.response);
              this.deselectCheckedProducts();
            }

            }, (error: any) => {
              console.log(error);
              this.notificationErrorChangeMultipleStatus(error);
            })

        }
      })
    }
  }

  deletePublication(product: ProductMeliPublished): void{
    Swal.fire({
      title: 'Está seguro?',
      text: 'Confirme la operación de eliminar!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {

        this.loading = true;
        if(product.status === StatesOfMeli.FAIL || product.status === StatesOfMeli.UNDER_REVIEW){
          this.productsMeliPublishedService.deletePublicationFailed(product.id)
          .subscribe((resp: any) => {

            this.loadProductsPaginator(true);
            if (resp.response) {
              this.notificationSuccessChangeStatus(resp.response);
            } else {
              this.notificationErrorChangeStatus(resp);
            }


          }, (error: any) => {
            console.log(error);
            this.notificationErrorChangeStatus(error);
          })
        }
        else{
          this.productsMeliPublishedService.deletePublication(product.accountMeli, product.status, product.idPublicationMeli)
          .subscribe((resp: any) => {

            this.loadProductsPaginator(true);
            if (resp.response) {
              this.notificationSuccessChangeStatus(resp.response);
            } else {
              this.notificationErrorChangeStatus(resp);
            }


          }, (error: any) => {
            console.log(error);
            this.notificationErrorChangeStatus(error);
          })
        }

      }
    })
  }

  republishPublication(product: ProductMeliPublished): void {

    Swal.fire({
      title: 'Está seguro?',
      text: 'Confirme la operación!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {

        if(product.title.length > 60){
          Swal.fire({
            position: 'top-end',
            title: 'Título o Nombre del producto no válido',
            text: 'No se permite publicar produtos con título mayor de 60 caracteres',
            icon: 'info',
            showConfirmButton: false,
            timer: 5000
          })
        }else{
          this.loading = true;
          this.productsMeliPublishedService.republishPublication(product.accountMeli, product.idPublicationMeli)
            .subscribe((resp: any) => {

              this.loadProductsPaginator(true);
              if (resp.response) {
                this.notificationSuccessChangeStatus(resp.response);
              } else {
                this.notificationErrorChangeStatus(resp);
              }

            }, (error: any) => {
              console.log(error);
              this.notificationErrorChangeStatus(error);
            })
        }
      }
    })
  }

  synchronizePublication(){
    this.loading = true;
    let publicationList: number[] = [];
    this.productsSelected.forEach(p => {
      publicationList.push(p.id);
    })

    this.productsMeliPublishedService.synchronizePublication(publicationList).subscribe(resp => {
      if(resp.response){
        Swal.fire({
          position: 'top-end',
          title: 'Productos sincronizados',
          text: 'Los productos han sido sincronizado satisfactoriamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 5000
        })
      }
      else{
        Swal.fire({
          position: 'top-end',
          title: 'Productos no sincronizados',
          text: 'Todos los productos no han sido sincronizados. Vuelva a intentarlo.',
          icon: 'warning',
          showConfirmButton: false,
          timer: 5000
        })
      }
      this.loadProductsPaginator(true);
    }, error => {
      Swal.fire({
        position: 'top-end',
        title: 'Productos no sincronizados',
        text: 'Todos los productos no han sido sincronizados. Vuelva a intentarlo.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 5000
      });
      this.loadProductsPaginator(true);
    });
  }

  notificationSuccessChangeStatus(result: string): void {
    let title = '';
    switch (result) {
      case 'active':
        title = `activada`;
        break;

      case 'paused':
        title = `pausada`;
        break;

      case 'closed':
        title = `finalizada`;
        break;

      case 'deleted':
        title = `eliminada`;
        break;

      default:
        title = 'no cambiada';
        break;
    }
    Swal.fire({
      position: 'top-end',
      icon: result !== 'error' ? 'success' : 'error',
      title: `Publicación ${title} satisfactoriamente`,
      showConfirmButton: true,
      timer: 2000
    }).finally(() => this.loading = false);
  }

  notificationErrorChangeStatus(error?: any): void {

    console.log('Error: ', error);
    let title = 'No se pudo realizar la operación, intente sincronizar su cuenta o consulte al administrador';

    if (error.error_meli !== undefined) {
      title = `${title}, mercadolibre no procesó el cambio`;
    }
    this.loading = false
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: `${title}`,
      showConfirmButton: true
    });
  }

  notificationErrorChangeMultipleStatus(error?: any): void {
    let title = 'No todas las publicaciones pudieron ser realizadas, intente sincronizar su cuenta o consulte al administrador';

    if (error.error_meli !== undefined ) {
      title = `${title}, mercadolibre no procesó el cambio`;
    }

    this.loading = false
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: `${title}`,
      showConfirmButton: true
    });
  }

}
