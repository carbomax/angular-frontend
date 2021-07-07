import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MarginService } from '../../../../services/margin.service';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';
import { ProductsMeliPublishedService } from '../../../../services/products.meli.published.service';
import Swal from 'sweetalert2';
import { ProductMeliPublished } from '../../../../../models/meli-publication/product-meli-published.model';
import { Image } from '../../../../../models/image.model';
import { AccountMarginModel } from 'src/app/models/relatioship-account-margin.model';
import { ResponseCategoryPredictor } from 'src/app/models/meli-publication/response-category-predictor.model';
import { MeliCategory } from 'src/app/models/meli-publication/meli-category.model';
import { MeliPathRoot } from 'src/app/models/meli-publication/meli-path-from-root.model';
import { Margin } from 'src/app/models/margin';
import { MeliAccount } from 'src/app/models/meli.account';
import { AccountMeliStates } from 'src/app/enums/account-meli-states.enum';
import { MarketplaceType } from 'src/app/enums/marketplacetype.enum';
import { StatesOfMeli } from 'src/app/enums/states-of-meli.enum';
import { EditableProductModel } from 'src/app/models/editable.product.model';
import { MeliME2Category } from 'src/app/models/meli-publication/meli-me2-category';
import { UploadImagesService } from 'src/app/home/services/upload-images.service';


@Component({
  selector: 'app-edit-products-published',
  templateUrl: './edit-products-published.component.html',
  styleUrls: ['./edit-products-published.component.css']
})

export class EditProductsPublishedComponent implements OnInit {

  @ViewChild('closeModal') closeModal;
  @ViewChild('closeMargin') closeMargin;
  @ViewChild('checkConfig') checkConfig;
  @ViewChild('file') myfile;

 //Loading Modal
 loadingModal = false;
 loadingPublicationModal = false;
 textLoading = 'Publicando...';

  productsDeletedList: number[];
  imagesDeletedList: string[];
  productMeliPublished: ProductMeliPublished;
  imageToDelete: Image;
  meliCategoryActive: MeliCategory;
  subCategoriesActiveList: MeliPathRoot[];
  pathActive: string = "";

  loadedAccountMeli: boolean = false;
  loadedMarginMeli: boolean = false;
  reloadConfig: boolean = false; // si habilitó la reconfiguracion
  activeConfig: boolean = false;
  init: boolean = true;
  hideCard: boolean = false;
  formSaved: boolean = false;

  edit = false;
  message: string;
  imagePath: string;
  imgURL: any;
  file: any;
  titleImage:string;
  orderImage: number;

  id: number = -1;
  public urlP = "";
  public titleP: string;
  public orderP: number = -1;

  /**Seccion para la vista Publicar */
  meliAccountsList: MeliAccount[];
  meliAccountSelected: MeliAccount;
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
    public marginService: MarginService,public meliPublicationsService: MeliPublicationsService, public productsMeliPublishedService: ProductsMeliPublishedService,
    public uploadImageService: UploadImagesService ) { }

  ngOnInit(): void {
    this.account_margin = new AccountMarginModel();
    this.responsePredictor = new ResponseCategoryPredictor();
    this.responsePredictor.predictor = false;

    this.getProduct();
    //this.getAccountMeli();
    //this.getMargins();
    //this.loadRelationAccountMargin();
    //this.getPredictorCategories();
    this.productsDeletedList = [];
    this.imagesDeletedList = [];
    this.accountMarginsList = [];

  }

  checkInitial(): void{
    if(this.loadedAccountMeli && this.loadedMarginMeli && this.init){
        this.loadRelationAccountMargin();
    }
  }

  public get statesOfMeli(): typeof StatesOfMeli {
    return StatesOfMeli;
  }

  decipherContent(encodeContent: string){
    let piece = Math.trunc(encodeContent.length / 3);
    let truck = encodeContent.substring(piece, piece*2) + encodeContent.substring(0, piece) + encodeContent.substring(piece*2);
    let content = atob(truck);
    return content;
  }
/*
  getProduct(){
    let encode = this._router.snapshot.paramMap.get('product');
   // let product = this.decipherContent(encode);
    this.productMeliPublished = JSON.parse(encode);
    this.getCategoryOfActiveProduct(this.productMeliPublished.categoryMeli);
  }
*/
  getProduct(){
    this.productsMeliPublishedService.getOnePublication(+this._router.snapshot.paramMap.get('id')).subscribe(item => {
      //this.loadingModal = true;
      this.productMeliPublished = item;
      this.getCategoryOfActiveProduct(this.productMeliPublished.categoryMeli);
      this.getAccountMeli();
    this.getMargins();
    });
  }

  getPredictorCategories(){
    /*
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
    });*/
  }

  getCategoryOfActiveProduct(idCategory: string){
    this.subCategoriesActiveList = [];
      this.meliPublicationsService.getMeliSubCategories(idCategory).subscribe(category => {
          this.meliCategoryActive = category;
          this.subCategoriesActiveList = this.meliCategoryActive.path_from_root;
          this.lastCategorySelected.idLastCategory = this.meliCategoryActive.id;
          this.lastCategorySelected.isME2 = this.meliCategoryActive.shipping_modes.includes('me2');
          for (let index = 0; index < this.subCategoriesActiveList.length; index++) {
            if(index + 1 === this.subCategoriesActiveList.length){
              this.pathActive = this.pathActive + this.subCategoriesActiveList[index].name;
            }
            else{
              this.pathActive = this.pathActive + this.subCategoriesActiveList[index].name + " > ";
            }
          }
          return this.meliCategoryActive;
      })
  }

  saveForm(){
    this.loadingModal = true;
    this.productsMeliPublishedService.updateProductsPublished(this.productMeliPublished, this.productsDeletedList).subscribe(item => {
      this.productsDeletedList = [];
      this.loadingModal = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Actualizado`,
        text: `Sus cambios han sido actualizados correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });

      this.productMeliPublished = item;

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
    this.productsMeliPublishedService.updateProductsPublished(this.productMeliPublished, this.productsDeletedList).subscribe(item => {
      this.productsDeletedList = [];
      this.loadingModal = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Actualizado`,
        text: `Sus cambios han sido actualizados correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });

      this.productMeliPublished = item;

      //Elimino las imagenes fisicamente del servidor
      if(this.imagesDeletedList.length !== 0){
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

  editImage(image: Image){
    this.id = +image.id;
    this.edit = true;

    this.orderP = image.order;;
    this.titleP = image.title;
    this.urlP = image.photos
  }

  updateImage(image: Image){
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

  cancelImage(){
    this.clear();
  }

  deleteImage(){

    this.productsDeletedList.push(this.imageToDelete.id);
    this.imagesDeletedList.push(this.imageToDelete.photos);
    let position = this.productMeliPublished.images.indexOf(this.imageToDelete);
    this.productMeliPublished.images.splice(position, 1);
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
    let filename = this.productMeliPublished.sku + "_";
    filename = filename + this.productsStorageUserService.getRandomInt(1,1000000) + "_" + this.file.name.replace(/ /g, "");
    formData.append('image', this.file, filename.trim());

    this.productsStorageUserService.uploadImage(formData)
      .subscribe(resp => {
        if(resp.success === true) {
        let image_added = new Image();
        image_added.order = this.orderImage;
        image_added.title = this.titleImage;
        image_added.photos = resp.reason;
        this.productMeliPublished.images.push(image_added);

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
          this.productMeliPublished.images.push(image_added);
        }
        else if(error.error.message.includes('Maximum upload size exceeded')){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error`,
          text: 'Su imagen excede el tamaño máximo de configurado, Contacte con el administrador para mayor información',
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
        this.productMeliPublished.images.push(image_added);

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
          this.productMeliPublished.images.push(image_added);
        }
        else if(error.error.message.includes('Maximum upload size exceeded')){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error`,
          text: 'Su imagen excede el tamaño máximo de configurado, Contacte con el administrador para mayor información',
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
        this.clearImage();
        this.close();

      });
  }

  clearImage(){
    this.orderImage = null;
    this.titleImage = "";
    this.message = "";
    this.imagePath = "";
    this.imgURL = null;
    this.file = null;
    this.myfile.nativeElement.value = "";
  }

  close(){
    this.closeModal.nativeElement.click();
  }

  /** Seccion para la vista Publicar */

  loadRelationAccountMargin(){
    if(this.productMeliPublished.margin !== -1){
      this.margin = this.productMeliPublished.margin;
    }
    this.meliAccount = this.productMeliPublished.accountMeli;
    this.addRelationAccountMargin();
    this.init = false; //ya inicializó (init = false)
  }

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
      }else{
        accountMargin.accountName = account.businessName;
        accountMargin.idAccount = account.id;
        accountMargin.showOptionFlexbyAdmin = account.enabledFlexByAdmin === 1 ? true : false; // verifica permiso de opcion flex disponible
        accountMargin.flex = this.productMeliPublished.flex === 1 ? true : false;

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

  changeConfig(check: boolean){
    this.checkConfig.nativeElement.checked = 0;
    if(!this.reloadConfig){ // no ha sido reconfigurado
      if(check === true){
        Swal.fire({
          title: 'Importante',
          icon: 'info',
          text: 'El margen asociado y el precio de publicación actual se perderán al habilitar esta opción. ¿Deseas continuar?',
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
              this.activeConfig = true;
              this.reloadConfig = true; // activo reconfiguración
              this.accountMarginsList.forEach(result => {
                this.account_margin = result;
                this.deleteRelationAccountMargin();
              });
              this.checkConfig.nativeElement.checked = 1;
            } else {
              this.activeConfig = false;
            }
        })
      }
      else{
        this.activeConfig = false;
      }
    }

  }

  reloadView(){
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
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

      //Para disparar el metodo loadRelationAccountMargin()
      this.loadedAccountMeli = true;
      if(this.init){
        this.checkInitial();
      }
    })
  }

  compareAccountById(o1, o2) {
    return o1.id === o2.id
  }

  deleteRelationAccountMargin(){
    if(this.account_margin != null){
      let account = this.initialMeliAccounts.find(element => element.id == this.account_margin.idAccount);
      this.meliAccountsList = [account]; // Solo muestra la cuenta de ML con la cual fue publicado el producto
      this.meliAccountSelected = account;// Para que la cuenta aparezca fija y no tener que volver a seleccionar
      let position = this.accountMarginsList.indexOf(this.account_margin);
      this.accountMarginsList.splice(position, 1);
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
      //Para disparar el metodo loadRelationAccountMargin()
      this.loadedMarginMeli = true;
      if(this.init){
        this.checkInitial();
      }
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
    //this.meliAccount = -1;
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

  closeEditPublished(){
    this.clearAll();
    this.router.navigate(['/home/published-products']);
  }

  publishProducts(){
    if(this.productMeliPublished.title.length > 60){
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
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: `Producto en publicación`,
      text: `El producto está siendo publicado`,
      showConfirmButton: false,
      timer: 5000
    })
    .then((result) => {
      this.router.navigate(['/home/published-products']);
    });

      let editableProduct =  new EditableProductModel();
      editableProduct.id = this.productMeliPublished.mlPublicationId;
      editableProduct.currentStock = this.productMeliPublished.currentStock;
      editableProduct.description = this.productMeliPublished.description;
      editableProduct.images = this.productMeliPublished.images;
      editableProduct.price = +this.productMeliPublished.pricePublication;
      editableProduct.price_costUYU = this.productMeliPublished.priceCostUYU;
      editableProduct.price_costUSD = this.productMeliPublished.priceCostUSD;
      editableProduct.productName = this.productMeliPublished.title;
      editableProduct.sku = this.productMeliPublished.sku;
      editableProduct.states = 1;

  // llamada al servicio Publicar
   this.meliPublicationsService.createPublicationByEditableProduct(this.accountMarginsList, this.lastCategorySelected.idLastCategory, this.warrantyType, this.warrantyTime, this.warranty, editableProduct);
   this.clearAll();
  }

  updateProductPublish(){
    if(this.productMeliPublished.title.length > 60){
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
          this.callUpdateProductPublishService();
          this.formSaved = true;
        }
      })
    }else{
      this.callUpdateProductPublishService();
      this.formSaved = true;
    }

  }

  callUpdateProductPublishService(){
    this.textLoading = 'Actualizando publicación...';
    this.loadingPublicationModal = true;
    this.meliPublicationsService.updateProductPublish(this.productMeliPublished, this.accountMarginsList, this.reloadConfig).subscribe(product => {
        if(product){// ver codigo del response
          this.loadingPublicationModal = false;
          this.productMeliPublished = product;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Satisfactorio`,
            text: `La publicación ha sido actualizada satisfactoriamente`,
            showConfirmButton: false,
            timer: 5000
          })
        }
        else{
          this.loadingPublicationModal = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `No actualizado`,
            text: `La publicación no ha sido actualizada. Sincronice el producto con Mercado Libre y vuelva a intentarlo`,
            showConfirmButton: false,
            timer: 5000
          })
        }
    }, (error: any) => {
        if(error){
          this.loadingPublicationModal = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `No actualizado`,
            text: `La publicación no ha sido actualizada. Sincronice el producto con Mercado Libre y vuelva a intentarlo`,
            showConfirmButton: false,
            timer: 5000
          })
        }
    })
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
    this.hideCard = true;
  }

}
