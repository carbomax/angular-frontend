import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Options, LabelType } from 'ng5-slider';

import { PageProductMeliStorage } from 'src/app/models/page.myproduct.custom.model';
import { AccountMarginModel } from 'src/app/models/relatioship-account-margin.model';
import { ProductCustom } from 'src/app/models/myproducts.custom.model';
import { Margin } from 'src/app/models/margin';
import { MeliAccount } from 'src/app/models/meli.account';

import { ProductsStorageService } from '../../../../services/products-storage.service';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { MarginService } from '../../../../services/margin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';

import { PaginationInstance } from 'ngx-pagination';
import { MatDialog, MatDialogModule, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupAddcommoninfoComponent } from '../../../../components/modals/popup-addcommoninfo/popup-addcommoninfo.component';
import { States } from 'src/app/enums/states.enum';
import { MarketplaceType } from 'src/app/enums/marketplacetype.enum';
import { AccountMeliStates } from 'src/app/enums/account-meli-states.enum';
import { elementAt } from 'rxjs/operators';


@Component({
  selector: 'app-publish-myproducts',
  templateUrl: './publish-myproducts.component.html',
  styleUrls: ['./publish-myproducts.component.css']
})
export class PublishMyproductsComponent implements OnInit {

  @ViewChild('closeModal') closeModal;
  @ViewChild('checkAllP') checkAllP;
  @ViewChild('checkP') checkP;
  @ViewChild('closeMargin') closeMargin;
  @ViewChild('closePublishModal') closePublishModal;

  //Loading Modal
  loadingModal = false;
  loadingModalDelete = false;

  public loading = true;
  public loadPaginator = false;
  public loadingClear = false;
  public errorProducts = false;
  public empySearch = false;
  public nameSeach = '';
  public skuSearch = '';
  public typeProductSearchClear = '';
  public typeStateSearchClear = '';
  public typeFamilySearchClear = '';
  public typeProductSearch = '';
  public typeStateSearch = '';
  public typeFamilySearch = '';
  public minValue = 0;
  public maxValue = 20000;

  productsStorage: ProductCustom[];
  pageProductsMeli = new PageProductMeliStorage();
  stateEnum = States;
  productsSelected: ProductCustom[];
  disable: boolean = true;
  loadingDeleteProduct: boolean = false;
  productToDelete: ProductCustom;

  //security
  profileId: number;

  // Paginator
  totalPages: number;
  currentPage: number = 1;
  selectedPage = 0;
  page = 0;
  size: number = 5;
  checkAll = false;

  // Range price filter
  options: Options = {
    floor: 0,
    ceil: this.maxValue,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Mínimo:</b> ' + value;
        case LabelType.High:
          return '<b>Máximo:</b> ' + value;
        default:
          return '' + value;
      }
    }
  };

  //Variables from Add Common Data Modal
  message: string;
  file: any;
  fileList: any[];
  imagePath: string;
  imgURL: any;
  imagesList: string[];
  imageStoreList: string[];
  description = "";

  //Variables from Publish in Meli
  categoryPath: string;
  home: boolean = false;
  pathList: string[];
  meliAccountsList: MeliAccount[];
  initialMeliAccounts: MeliAccount[];
  account_margin: AccountMarginModel;
  accountMarginsList: AccountMarginModel[];
  marginsList: Margin[];  
  margin: number = -1;
  meliAccount: number = -1;
  lastCategorySelected: string = '-1';
  warrantyType: number = -1;
  warrantyTime: number = 0;
  warranty: boolean = false;


  constructor(public productStoreService: ProductsStorageService, public productStoreUserService: ProductsStorageUserService, public dialog: MatDialog,
    private authService: AuthService, public meliAccountService: MeliAccountService, public marginService: MarginService, public meliPublicationsService: MeliPublicationsService, private router: Router) {

  }

  //Change size elements of the table
  selectChangeHandler(size): void {
    this.size = +size;
    this.loadProductsPaginator(1);
  }

  loadProductsPaginator(page?: number): void {
    this.profileId = null;
    this.profileId = this.authService.authenticationDataExtrac().profileId;
    this.loadPaginator = true;
    this.productStoreUserService.
      getPageMyCustomProducts(this.profileId, this.currentPage = +page - 1, this.size, this.skuSearch,
        this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemCustomGrid => {
        this.pageProductsMeli = this.productStoreUserService.pageProductsMeli;
        let countSelected = 0;
        console.log('result', this.pageProductsMeli)
        this.pageProductsMeli.itemsMeliGrid.forEach(element => {
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
        this.loadPaginator = false;
      }, error => {
        this.loading = false;
        this.errorProducts = true;
        this.loadPaginator = false;
      });
  }

  ngOnInit(): void {
    this.account_margin = new AccountMarginModel();
    this.getAccountMeli();
    this.getMargins();
    this.loadingModal = false;
    this.imagesList = [];
    this.fileList = [];
    this.productsSelected = [];
    this.disable = true;
    this.imageStoreList = [];
    this.accountMarginsList = [];
    this.pathList = [];

    if (this.authService.isAuthenticated) {
      this.profileId = null;
      this.profileId = this.authService.authenticationDataExtrac().profileId;
      this.loading = true;
      this.errorProducts = false;
      this.productStoreUserService.getPageMyCustomProducts(this.profileId, 0, this.size, this.skuSearch, this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
        .subscribe(pageItemCustomGrid => {
          this.pageProductsMeli = this.productStoreUserService.pageProductsMeli;
          this.totalPages = +this.pageProductsMeli.totalPages;
          if (this.pageProductsMeli.itemsMeliGrid.length <= 0) {
            this.errorProducts = true;
          }
          this.loading = false;
        }, (error: any) => {
          this.errorProducts = true;
          this.loading = false;
        })
    }
    else {
      this.router.navigate(['auth/login']);
    }
  }

  selectAllProducts(): void {
    this.checkAll = !this.checkAll;

    this.pageProductsMeli.itemsMeliGrid.forEach(element => {
      element.selected = this.checkAll;
      if (element.selected === true) {
        let position1 = -1;
        this.productsSelected.forEach(pro => { if (pro.id === element.id) { position1 = this.productsSelected.indexOf(pro); } });
        if (position1 === -1) {
          this.productsSelected.push(element);
        }
      }
      else {
        let position = -1;
        this.productsSelected.forEach(pro => { if (pro.id === element.id) { position = this.productsSelected.indexOf(pro); } });
        if (position !== -1) {
          this.productsSelected.splice(position, 1);
        }
      }
    });
    if (this.productsSelected.length === 0) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  selectProduct(product: ProductCustom): void {
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

  /* ********************  Here begin the searching ************************** */
  searchProducts(): void {

    if (this.authService.isAuthenticated) {
      this.profileId = null;
      this.profileId = this.authService.authenticationDataExtrac().profileId;

      this.loadPaginator = true;
      this.empySearch = false;
      this.loadingClear = false;
      this.productStoreUserService.
        getPageMyCustomProducts(this.profileId, this.selectedPage = 0, this.size, this.skuSearch,
          this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
        .subscribe(pageItemCustomGrid => {
          this.pageProductsMeli = this.productStoreUserService.pageProductsMeli;
          this.totalPages = +this.pageProductsMeli.totalPages;
          this.loadPaginator = false;
          this.errorProducts = false;
          if (this.pageProductsMeli.itemsMeliGrid.length === 0) {
            this.empySearch = true;
            this.pageProductsMeli.itemsMeliGrid = null;
          }
        }, (error: any) => {
          console.log('Error', error);
          this.loadPaginator = false;
          this.errorProducts = false;
          this.empySearch = true;
        });
    }
    else {
      this.router.navigate(['auth/login']);
    }
  }
  // Clear search form
  clearSearch(f: NgForm): void {

    this.loadingClear = true;
    this.nameSeach = '';
    this.skuSearch = '';
    this.typeProductSearch = '';
    this.typeStateSearch = '';
    this.typeFamilySearch = '';
    this.minValue = 0;
    this.maxValue = 20000;
    this.productStoreUserService.
      getPageMyCustomProducts(this.profileId, this.selectedPage = 0, this.size, this.skuSearch,
        this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
      .subscribe(pageItemGrid => {
        this.pageProductsMeli = this.productStoreUserService.pageProductsMeli;
        this.totalPages = +this.pageProductsMeli.totalPages;
        if (this.pageProductsMeli.itemsMeliGrid.length > 0) {
          this.empySearch = false;
        }
        this.loadingClear = false;
      }, (error: any) => {
        this.loadingClear = false;

      });

  }

  saveCommonInfo() {
    this.loadingModal = true;
    this.imageStoreList = [];
    if (this.productsSelected.length === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error en el proceso`,
        text: `Usted no ha seleccionado productos en la tabla`,
        showConfirmButton: false,
        timer: 5000
      });
      this.closeActiveModalLoading();
      return;
    }

    if (this.fileList.length !== 0) {
      this.fileList.forEach(ima => {
        if (ima.type.match(/image\/*/) === null) {
          this.close();
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Solo imagenes`,
            text: 'Existen archivos que no son una imagen',
            showConfirmButton: false,
            timer: 5000
          });
          this.closeActiveModalLoading();
          return;
        }
      })
    }

    if (this.fileList.length !== 0) {
      this.productStoreUserService.uploadImageSyn(this.fileList).then(data => {
        let resultList = data;
        resultList.forEach(element => {
          if (element.success === true) {
            this.imageStoreList.push(element.reason);
          }
          else {
            this.closeActiveModalLoading();
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `Error en el proceso`,
              text: `La información no fue almacenada. Contacte con el administrador del sistema`,
              showConfirmButton: false,
              timer: 5000
            });
          }
        });
        if (resultList.length === this.imageStoreList.length) {
          this.updateInDataBaseCommonInfo();
        } else {
          this.closeActiveModalLoading();
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error en el proceso`,
            text: `Error almacenando imágenes. Contacte con el administrador`,
            showConfirmButton: false,
            timer: 5000
          });
        }
      }, error => {
        this.closeActiveModalLoading();
        if (error.error.message.includes('Maximum upload size exceeded')) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error en el proceso`,
            text: 'Su imagen excede el tamaño máximo permitido de 2MB (Mega Byte).',
            showConfirmButton: false,
            timer: 5000
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error en el proceso`,
            text: `La información no fue almacenada. Contacte con el administrador del sistema`,
            showConfirmButton: false,
            timer: 5000
          })
        }
      });
    } else if (this.description.length !== 0) {
      this.updateInDataBaseCommonInfo();
    }
    else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error en el proceso`,
        text: `Usted no ha adicionado nueva información.`,
        showConfirmButton: false,
        timer: 5000
      });
      this.closeActiveModalLoading();
      return;
    }
  }

  updateInDataBaseCommonInfo() {
    this.profileId = null;
    this.profileId = this.authService.authenticationDataExtrac().profileId;

    this.productStoreUserService.updateCommonInfo(this.profileId, this.description, this.productsSelected, this.imageStoreList).subscribe(result => {
      if (result.success === true) {
        this.closeActiveModalLoading();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Información almacenada`,
          text: `La información fue almacenada correctamente`,
          showConfirmButton: false,
          timer: 5000
        });
        this.clearAllImage();
        this.close();
      }
      else {
        this.closeActiveModalLoading();
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error en el proceso`,
          text: `La información no fue almacenada. Contacte con el administrador del sistema`,
          showConfirmButton: false,
          timer: 5000
        });
      }
    }, error => {
      this.closeActiveModalLoading();
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error en el proceso`,
        text: `La información no fue almacenada. Contacte con el administrador del sistema`,
        showConfirmButton: false,
        timer: 5000
      });
    })
  }

  deleteProducts() {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Los productos eliminados los perderás del almacen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
          this.loadingModalDelete = true;
          this.productStoreUserService.deleteProductsFromStore(this.productsSelected).subscribe(resp => {
      if (resp === true) {
        this.loadingModalDelete = false;
        this.loadProductsPaginator(this.currentPage);        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Éxitos`,
          text: `Los productos fueron eliminados satisfactoriamente.`,
          showConfirmButton: false,
          timer: 5000
        });
        /*
        this.productsSelected.forEach(select => {
          this.pageProductsMeli.itemsMeliGrid.forEach(element => {
            if (element.id === select.id) {
              let position = this.pageProductsMeli.itemsMeliGrid.indexOf(element);
              if (position >= 0) {
                this.pageProductsMeli.itemsMeliGrid.splice(position, 1);
              }
            }
          });
        });
        */
        this.productsSelected = [];
        if (this.productsSelected.length === 0) {
          this.disable = true;
        } else {
          this.disable = false;
        }
      }
      else {
        this.loadingModalDelete = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error eliminando`,
          text: `Productos no eliminados. Sincronize y vuelva a intentarlo`,
          showConfirmButton: false,
          timer: 5000
        });
      }
    }, error => {
      this.loadingModalDelete = false;
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error eliminando`,
        text: `Productos no eliminados. Sincronize y vuelva a intentarlo`,
        showConfirmButton: false,
        timer: 5000
      });
    });

      }
    })



  }

  deleteOneProduct(product: ProductCustom) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "El producto será eliminado del almacen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productToDelete = product;
        this.loadingDeleteProduct = true;     
        this.productStoreUserService.deleteProductFromStore(product).subscribe(resp => {
      if (resp === true) {
        this.loadingDeleteProduct = false;
        //this.loadingModalDelete = false;
        this.loadProductsPaginator(this.currentPage);  
        this.productToDelete = null;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Éxitos`,
          text: `Producto eliminados satisfactoriamente.`,
          showConfirmButton: false,
          timer: 5000
        });
/*
        this.pageProductsMeli.itemsMeliGrid.forEach(element => {
          if (element === product) {
            let position = this.pageProductsMeli.itemsMeliGrid.indexOf(element);
            if (position >= 0) {
              this.pageProductsMeli.itemsMeliGrid.splice(position, 1);
            }
          }
        });
*/
        let pos = this.productsSelected.indexOf(product);
        if (pos !== -1)
          this.productsSelected.splice(pos, 1);
        if (this.productsSelected.length === 0) {
          this.disable = true;
        } else {
          this.disable = false;
        }
      }
      else {
        this.productToDelete = null;
        this.loadingDeleteProduct = false;
        this.loadingModalDelete = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error eliminando`,
          text: `Producto no eliminado. Sincronice y vuelva a intentarlo`,
          showConfirmButton: false,
          timer: 5000
        });
      }
    }, error => {
      this.productToDelete = null;
      this.loadingDeleteProduct = false;
      this.loadingModalDelete = false;
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error eliminando`,
        text: `Producto no eliminado. Sincronice y vuelva a intentarlo`,
        showConfirmButton: false,
        timer: 5000
      });
    });
      }
    });
  }

  /* ************* Modal View Upload Images ********** */
  preview(files) {
    if (files.length === 0) {
      this.file = null;
      this.message = "Archivo inválido";
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.file = null;
      this.message = "El archivo no es una imagen.";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.imagesList.push(this.imgURL);
      this.message = "";
      this.fileList.push(files[0]);
    }

  }

  deleteImage(image) {

    this.imagesList.forEach(element => {
      if (element === image) {
        let position = this.imagesList.indexOf(image);
        //elimino de la lista de rutas
        this.imagesList.splice(position, 1);

        //elimino de la lista de imagenes (byte)
        var reader = new FileReader();
        this.fileList.forEach(element1 => {
          reader.readAsDataURL(element1);
          reader.onload = (_event) => {
            let url = reader.result;
            if (url === image) {
              let position1 = this.fileList.indexOf(element1);
              this.fileList.splice(position1, 1);
            }
          }
        });
      }
    })
  }

  addImageList() {
    if (this.fileList.length !== 0) {
      this.fileList.forEach(ima => {
        if (ima.type.match(/image\/*/) === null) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Solo imagenes`,
            text: 'Existen archivos que no son una imagen',
            showConfirmButton: false,
            timer: 5000
          });
          return false;
        }
      })
    }



  }

  clearAllImage() {
    this.message = "";
    this.fileList = [];
    this.imagesList = [];
    this.imageStoreList = [];
    this.description = "";
  }

  close() {
    this.closeModal.nativeElement.click();
  }

  closeActiveModalLoading() {
    this.loadingModal = false;
  }

  getPath(pathList: string[]) {
    this.pathList = [];
    this.pathList = pathList;
    this.home = false;
  }

  getCategorySelected(idCategory: string) {
    this.lastCategorySelected = idCategory;
    //Pendiente para cuando se seleccione los atributos
   /* if(this.lastCategorySelected !== '-1'){
      this.attributeRequiredList = [];
      this.meliPublicationsService.getAttributesRequired(idCategory).subscribe(attr => {
        this.attributeRequiredList = attr;
      });
    }*/
  }

  setHome() {
    this.home = true;
    this.pathList = [];
  }

  getAccountMeli() {
    this.meliAccountsList = [];
    this.initialMeliAccounts = [];
    this.meliAccountService.getAccounts().subscribe(resp => {
      resp.forEach(element => {
        if (element.status === AccountMeliStates.SYNCHRONIZED && element.marketplaceId === MarketplaceType.MERCADOLIBRE) {
          this.meliAccountsList.push(element);
        }
      });
      this.meliAccountsList.forEach(element => { this.initialMeliAccounts.push(element); });
    })
  }

  getMargins() {
    this.marginsList = [];
    this.marginService.getMargins().subscribe(resp => {
      resp.forEach(element => {
        if (element.marketplaceId === MarketplaceType.MERCADOLIBRE) {
          this.marginsList.push(element);
        }
      });
    })
  }

  addRelationAccountMargin() {
    if (this.meliAccount !== -1) {
      let accountMargin = new AccountMarginModel();

      var account = this.meliAccountsList.find(element => element.id == this.meliAccount);
      accountMargin.accountName = account.businessName;
      accountMargin.idAccount = account.id;

      if (this.margin !== -1) {
        var margin = this.marginsList.find(element => element.id == this.margin);
        accountMargin.idMargin = margin.id;
        accountMargin.nameMargin = margin.name;
        accountMargin.typeMargin = margin.type;
        accountMargin.valueMargin = margin.value;
      } else {
        accountMargin.idMargin = -1;
        accountMargin.nameMargin = "";
      }
      this.accountMarginsList.push(accountMargin);
      let index = this.meliAccountsList.indexOf(account);
      this.meliAccountsList.splice(index, 1);
      this.closeModalMargin();
    }
  }

  previewDelete(relationship: AccountMarginModel) {
    this.account_margin = relationship;
  }

  deleteRelationAccountMargin() {
    if (this.account_margin != null) {
      let account = this.initialMeliAccounts.find(element => element.id == this.account_margin.idAccount);
      let position = this.initialMeliAccounts.indexOf(account);
      this.meliAccountsList.splice(position, 0, account);
      let position2 = this.accountMarginsList.indexOf(this.account_margin);
      this.accountMarginsList.splice(position2, 1);
    }
  }

  clearAll() {
    this.account_margin = null;
    this.margin = -1;
    this.meliAccount = -1;
  }

  closeModalPublish() {
    this.account_margin = null;
    this.accountMarginsList = [];
    this.meliAccountsList = [];
    this.pathList = [];
    this.home = true;
    this.warrantyType = -1;
    this.warrantyTime = -1;
    this.warranty = false;
    this.initialMeliAccounts.forEach(element => { this.meliAccountsList.push(element); });
    this.closePublishModal.nativeElement.click();
  }

  closeModalMargin() {
    this.clearAll();
    this.closeMargin.nativeElement.click();
  }

  publishProducts() {
    let allTitle = true;

    this.productsSelected.forEach(prod => {
       if(prod.name.length > 60){
          allTitle = false;
        }
    });

    if(!allTitle){
      Swal.fire({
        position: 'top-end',
        title: 'Título o Nombre del producto no válido',
        text: 'No se permite publicar produtos con título mayor de 60 caracteres',
        icon: 'info',
        showConfirmButton: false,
        timer: 5000
      })
    }else{
      // llamada al servicio Publicar
      this.meliPublicationsService.createPublicationList(this.accountMarginsList, this.lastCategorySelected, this.warrantyType, this.warrantyTime, this.warranty, this.productsSelected);
      this.closeModalPublish();
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: `Productos en publicación`,
        text: `Los productos están siendo publicados`,
        showConfirmButton: false,
        timer: 5000
      }).then(() => {
        for( var i = 0; i < this.pageProductsMeli.itemsMeliGrid.length; i++) {
          if ( this.pageProductsMeli.itemsMeliGrid[i].selected === true) {
            this.pageProductsMeli.itemsMeliGrid.splice(i, 1);
            i--;
          }
        }
        this.checkP.nativeElement.checked = 0;
          if(this.pageProductsMeli.itemsMeliGrid.length === 0){
            this.loadProductsPaginator(1);
          }
        });
    }

  }

}
