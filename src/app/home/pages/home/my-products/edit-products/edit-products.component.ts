import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MarginService } from '../../../../services/margin.service';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';
import Swal from 'sweetalert2';
import { EditableProductModel } from '../../../../../models/editable.product.model';
import { Image } from '../../../../../models/image.model';
import { AccountMarginModel } from 'src/app/models/relatioship-account-margin.model';
import { ResponseCategoryPredictor } from 'src/app/models/meli-publication/response-category-predictor.model';
import { Margin } from 'src/app/models/margin';
import { MeliAccount } from 'src/app/models/meli.account';
import { AccountMeliStates } from 'src/app/enums/account-meli-states.enum';
import { MarketplaceType } from 'src/app/enums/marketplacetype.enum';
import { MeliME2Category } from 'src/app/models/meli-publication/meli-me2-category';
import { UploadImagesService } from 'src/app/home/services/upload-images.service';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {
  @ViewChild('closeModal') closeModal;
  //@ViewChild('closeModalLoading') closeModalLoading;
  @ViewChild('closeMargin') closeMargin;
  @ViewChild('file') myfile;
 //Loading Modal
 loadingModal = false;
 loadingInitModal = false;

  productsDeletedList: number[];
  imagesDeletedList: string[];
  editableProduct: EditableProductModel;
  imageToDelete: Image;

  edit = false;
  message: string;
  imagePath: string;
  imgURL: any;
  file: any;
  titleImage:string;
  orderImage: number = 0;

  id: number = -1;
  public urlP = "";
  public titleP: string;
  public orderP: number = -1;

  /**Seccion para la vista Publicar */
  meliAccountsList: MeliAccount[];
  accountMarginsList: AccountMarginModel[];
  initialMeliAccounts: MeliAccount[];
  account_margin: AccountMarginModel;
  marginsList: Margin[];
  margin: number = -1;
  meliAccount: number = -1;
  warrantyType: number = -1;
  warrantyTime: number = 0;
  warranty: boolean = false;
  responsePredictor: ResponseCategoryPredictor;
  withoutPredictor: boolean = false;

  lastCategorySelected = new MeliME2Category('-1');
  home: boolean = false;
  pathList: string[];


  constructor(private _router: ActivatedRoute, private router: Router, public productsStorageUserService: ProductsStorageUserService, public meliAccountService: MeliAccountService,
    public marginService: MarginService,public meliPublicationsService: MeliPublicationsService, public uploadImageService: UploadImagesService ) { }

  ngOnInit(): void {
    this.loadingInitModal = true;
    this.account_margin = new AccountMarginModel();
    this.responsePredictor = new ResponseCategoryPredictor();
    this.responsePredictor.predictor = false;

    this.getCustomProduct();
    this.getAccountMeli();
    this.getMargins();
    //this.getPredictorCategories();
    this.productsDeletedList = [];
    this.imagesDeletedList = [];
    this.accountMarginsList = [];

  }

  getCustomProduct(){
    this.productsStorageUserService.getCustomProduct(+this._router.snapshot.paramMap.get('id')).subscribe(item => {
      this.loadingInitModal = false;
      this.editableProduct = item;
      this.getPredictorCategories();
    });
  }

  getPredictorCategories(){
     this.meliPublicationsService.getCategoryByPredictor(this.editableProduct.productName).subscribe(predictorList => {
      let p = predictorList;
      if(predictorList.length !== 0){
        this.responsePredictor.predictor = true;
         this.responsePredictor.meliPredictorCategory = predictorList;
      }
      else{
         this.responsePredictor.predictor = false;
         this.responsePredictor.meliPredictorCategory = [];
      }
     },(error: any) => {
         this.responsePredictor.predictor = false;
         this.responsePredictor.meliPredictorCategory = [];
    });
  }

  saveForm(){
    this.loadingModal = true;
    this.productsStorageUserService.updateCustomProduct(this.editableProduct, this.productsDeletedList).subscribe(item => {
      this.editableProduct = item;
      this.productsDeletedList = [];
      this.loadingModal = false;
      this.close();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Actualizado`,
        text: `Sus productos han sido actualizados correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });

      //Elimino las imagenes fisicamente del servidor
      if(this.imagesDeletedList.length !== 0){
      this.productsStorageUserService.deleteImages(this.imagesDeletedList).subscribe();
      this.imagesDeletedList = [];
    }

    },(error: any) => {
      this.loadingModal = false;
      this.close();
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error`,
        text: `Error al actualizar. Sincronice sus productos.`,
        showConfirmButton: false,
        timer: 5000
      });
      this.imagesDeletedList = [];
      this.productsDeletedList = [];
    });

  };

  //nuevo metodo
  saveForm2(){
    this.loadingModal = true;
    this.productsStorageUserService.updateCustomProduct(this.editableProduct, this.productsDeletedList).subscribe(item => {
      this.editableProduct = item;
      this.productsDeletedList = [];
      this.loadingModal = false;
      this.close();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Actualizado`,
        text: `Sus productos han sido actualizados correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });

      //Elimino las imagenes fisicamente del servidor
      if(this.imagesDeletedList.length !== 0) {
      this.uploadImageService.deleteImages(this.imagesDeletedList).subscribe();
      this.imagesDeletedList = [];
    }

    },(error: any) => {
      this.loadingModal = false;
      this.close();
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error`,
        text: `Error al actualizar. Sincronice sus productos.`,
        showConfirmButton: false,
        timer: 5000
      });
      this.imagesDeletedList = [];
      this.productsDeletedList = [];
    });

  };

  editProduct(image: Image){
    this.id = +image.id;
    this.edit = true;

    this.orderP = image.order;
    this.titleP = image.title;
    this.urlP = image.photos
  }

  updateProduct(image: Image){
    if(image.id === this.id){
      image.order = this.orderP;
      image.title = this.titleP;
      image.photos = this.urlP;
      this.clear();
    }
    else{
      this.clear();
    }
  }

  cancelProduct(){
    this.clear();
  }

  deleteImage(){
    this.productsDeletedList.push(this.imageToDelete.id);
    this.imagesDeletedList.push(this.imageToDelete.photos);
    let position = this.editableProduct.images.indexOf(this.imageToDelete);
    this.editableProduct.images.splice(position, 1);
  }

  previousDelete(image: Image){
    this.imageToDelete = image;
  }

  clear(){
    this.orderP = -1;
    this.titleP = "";
    this.urlP = "";
    this.id = -1;
    this.edit = false;
    this.imageToDelete = null;
  }

  /* ************* Subir Imagenes ********** */
  preview(files) {
    if (files.length === 0){
      this.file = null;
      this.myfile.nativeElement.value = "";
      this.message = "Archivo inválido";
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.file = null;
      this.myfile.nativeElement.value = "";
      this.message = "El archivo no es una imagen.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.message = "";
      this.file = files[0];
    }
  }

  addedImage() {
    if (!this.file) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Debe seleccionar un archivo`,
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }
    if (this.file.type.match(/image\/*/) == null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Solo imagenes`,
        text: 'El archivo no es una imagen',
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }
    const formData: FormData = new FormData();
    let filename = this.editableProduct.sku + "_";
    filename = filename + this.productsStorageUserService.getRandomInt(1,1000000) + "_" + this.file.name.replace(/ /g, "");
    formData.append('image', this.file, filename.trim());

    this.productsStorageUserService.uploadImage(formData)
      .subscribe(resp => {
        if(resp.success === true) {
        let image_added = new Image();
        image_added.order = this.orderImage;
        image_added.title = this.titleImage;
        image_added.photos = resp.reason;
        this.editableProduct.images.push(image_added);
        this.myfile.nativeElement.value = "";
        this.clearImage();
        this.close();
      }
      },(error: any) => {
        if(error.status >= 200 && error.status <= 299)
        {
          let image_added = new Image();
          image_added.order = this.orderImage;
          image_added.title = this.titleImage;
          image_added.photos = error.error.text;
          this.editableProduct.images.push(image_added);
        }
        else if(error.error.message.includes('Maximum upload size exceeded')){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error`,
          text: 'Su imagen excede el tamaño máximo permitido, lea la ayuda para mas información',
          showConfirmButton: false,
          timer: 5000
        });
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error`,
            text: 'Error almacenando la imagen. Contacte con el administrador',
            showConfirmButton: false,
            timer: 5000
          });
        }
        this.myfile.nativeElement.value = "";
        this.clearImage();
        this.close();

      });
  }

  //nuevo metodo
  addedImage2() {
    if (!this.file) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Debe seleccionar un archivo`,
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }
    if (this.file.type.match(/image\/*/) == null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Solo imagenes`,
        text: 'El archivo no es una imagen',
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }
    const formData: FormData = new FormData();
    let filename = this.file.name.replace(/ /g, "");
    formData.append('multipartFile', this.file, filename.trim());

    this.uploadImageService.uploadImage(formData)
      .subscribe(resp => {
        if(resp !== '') {
        let image_added = new Image();
        image_added.order = this.orderImage;
        image_added.title = this.titleImage;
        image_added.photos = resp;
        this.editableProduct.images.push(image_added);
        this.myfile.nativeElement.value = "";
        this.clearImage();
        this.close();
      }
      },(error: any) => {
        if(error.status >= 200 && error.status <= 299)
        {
          let image_added = new Image();
          image_added.order = this.orderImage;
          image_added.title = this.titleImage;
          image_added.photos = error.error.text;
          this.editableProduct.images.push(image_added);
        }
        else if(error.error.message.includes('Maximum upload size exceeded')){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error`,
          text: 'Su imagen excede el tamaño máximo permitido, lea la ayuda para mas información',
          showConfirmButton: false,
          timer: 5000
        });
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error`,
            text: 'Error almacenando la imagen. Contacte con el administrador',
            showConfirmButton: false,
            timer: 5000
          });
        }
        this.myfile.nativeElement.value = "";
        this.clearImage();
        this.close();

      });
  }

  clearImage(){
    this.orderImage = 0;
    this.titleImage = "";
    this.message = "";
    this.imagePath = "";
    this.imgURL = null;
    this.file = null;
    this.myfile.nativeElement.value = "";
  }

  close(){
    this.closeModal.nativeElement.click();
    //this.closeModalLoading.nativeElement.click();
  }

  /** Seccion para la vista Publicar */

  addRelationAccountMargin(){
    if(this.meliAccount !== -1){
      let accountMargin = new AccountMarginModel();
      var account = this.meliAccountsList.find(element => element.id == this.meliAccount);

      if(account.me2 !== 1){
        Swal.fire({
          title: 'Cuenta no permitida',
          text: 'La cuenta seleccionada no tiene mercado envío configurado. Configure su cuenta en Mercado Libre y vuelva a re-vincular su cuenta.',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        })
      }
      else{
        accountMargin.accountName = account.businessName;
        accountMargin.idAccount = account.id;
        accountMargin.showOptionFlexbyAdmin = account.enabledFlexByAdmin === 1 ? true : false; // verifica permiso de opcion flex disponible
        accountMargin.flex = false; // valor de flex en las publicaciones

        if(this.margin !== -1){
          var margin = this.marginsList.find(element => element.id == this.margin);
          accountMargin.idMargin =  margin.id;
          accountMargin.nameMargin = margin.name;
          accountMargin.typeMargin = margin.type;
          accountMargin.valueMargin = margin.value;
        }else{
          accountMargin.idMargin = -1;
          accountMargin.nameMargin = "";
        }
        this.accountMarginsList.push(accountMargin);
        let index = this.meliAccountsList.indexOf(account);
        this.meliAccountsList.splice(index, 1);
        this.closeModalMargin();
      }

    }
  }

  meliEnabledFlex(relationship: AccountMarginModel) {

    if(relationship.flex) {
      this.meliAccountService.isEnabledFlexToMeliAccount(relationship.idAccount).subscribe(result => {
        if(result === false) {
          Swal.fire({
            title: 'IMPORTANTE!!!',
            text: 'Su cuenta de Mercado Libre no le permite envios flex.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido!'
          })
          this.accountMarginsList.forEach( f => { if(f.idAccount === relationship.idAccount) f.flex = false });
        }
      }, error => {
        Swal.fire({
          icon: 'warning',
          title: `IMPORTANTE!!!`,
          text: `No se ha podido comprobar en Mercado Libre si le permite esta opción. Por el momento no puede publicar con flex. Intente mas tarde.`,
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido!'
        });
        this.accountMarginsList.forEach( f => { if(f.idAccount === relationship.idAccount) f.flex = false });
      } )
    }
  }

  getAccountMeli(){
    this.meliAccountsList = [];
    this.initialMeliAccounts = [];
    this.meliAccountService.getAccounts().subscribe(resp => {
      resp.forEach(element => {
        if(element.status === AccountMeliStates.SYNCHRONIZED && element.marketplaceId === MarketplaceType.MERCADOLIBRE){
          this.meliAccountsList.push(element);
        }
      });
      this.meliAccountsList.forEach(element => { this.initialMeliAccounts.push(element);});
    })
  }

  deleteRelationAccountMargin(){
    if(this.account_margin != null){
      let account = this.initialMeliAccounts.find(element => element.id == this.account_margin.idAccount);
      let position = this.initialMeliAccounts.indexOf(account);
      this.meliAccountsList.splice(position, 0, account);
      let position2 = this.accountMarginsList.indexOf(this.account_margin);
      this.accountMarginsList.splice(position2, 1);
    }
  }

  getMargins(){
    this.marginsList = [];
    this.marginService.getMargins().subscribe(resp => {
      resp.forEach(element => {
        if(element.marketplaceId === MarketplaceType.MERCADOLIBRE){
          this.marginsList.push(element);
        }
      });
    })
  }

  previewDelete(relationship: AccountMarginModel){
    this.account_margin = relationship;
  }

  closeModalMargin(){
    this.clearSome();
    this.closeMargin.nativeElement.click();
  }

  clearSome(){
    this.account_margin = null;
    this.margin = -1;
    this.meliAccount = -1;
  }

  clearAll(){
     this.account_margin = null;
    this.accountMarginsList = [];
    this.meliAccountsList = [];
    this.pathList = [];
    this.home = true;
    this.warrantyType = -1;
    this.warrantyTime = -1;
    this.warranty = false;
  }

  closeModalPublish(){
    this.clearAll();
    //this.initialMeliAccounts.forEach(element => { this.meliAccountsList.push(element);});
    this.router.navigate(['/home/publish-myproducts']);
  }

  publishProducts(){
    if(this.editableProduct.productName.length > 60){
      Swal.fire({
        position: 'top-end',
        title: 'Título o Nombre del producto demasiado extenso',
        text: 'Mercado Libre no permite publicar produtos con título mayor de 60 caracteres, de no editarse, la aplicación acortará el título al tamaño permitido',
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#28a745',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.callPublishProductsService();
        }
      })
    }else{
      this.callPublishProductsService();
    }


  }

  callPublishProductsService(){
    // llamada al servicio Publicar
    this.meliPublicationsService.createPublicationByEditableProduct(this.accountMarginsList, this.lastCategorySelected.idLastCategory, this.warrantyType, this.warrantyTime, this.warranty, this.editableProduct);
    this.clearAll();

    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: `Producto en publicación`,
      text: `El producto está siendo publicado`,
      showConfirmButton: false,
      timer: 5000
    })
    .then((result) => {
      this.router.navigate(['/home/publish-myproducts']);
    });
  }

  getPath(pathList: string[]){
    this.pathList = [];
    this.pathList = pathList;
    this.home = false;
  }

  getCategorySelected(category: MeliME2Category){
    this.lastCategorySelected = category;
    if(this.lastCategorySelected.idLastCategory !== '-1'){
      if(this.lastCategorySelected.isME2 === false ){
        Swal.fire({
          title: 'IMPORTANTE!!!',
          text: 'La categoría seleccionada no permite Mercado Envío como único modo. Seleccione otra categoría que sea mercado enviable.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido!'
        })
      }
    }
  }

  setHome(){
    this.home = true;
    this.pathList = [];
  }

  activeAllCategory(){
    this.withoutPredictor = true;
    this.setHome();
  }

}
