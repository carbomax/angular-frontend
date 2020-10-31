import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MarginService } from '../../../../services/margin.service';
import Swal from 'sweetalert2';
import { EditableProductModel } from '../../../../../models/editable.product.model';
import { Image } from '../../../../../models/image.model';
import { AccountMarginModel } from 'src/app/models/relatioship-account-margin.model';
import { Margin } from 'src/app/models/margin';
import { MeliAccount } from 'src/app/models/meli.account';
import { AccountMeliStates } from 'src/app/enums/account-meli-states.enum';
import { MarketplaceType } from 'src/app/enums/marketplacetype.enum';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {  
  @ViewChild('closeModal') closeModal;
  @ViewChild('closeModalLoading') closeModalLoading;
 //Loading Modal
 loadingModal = false; 

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
  orderImage: number;
  
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
  margin: number;


  constructor(private _router: ActivatedRoute, public productsStorageUserService: ProductsStorageUserService, public meliAccountService: MeliAccountService,
    public marginService: MarginService ) { }

  ngOnInit(): void {
    this.loadingModal = false;
    this.getCustomProduct();
    this.productsDeletedList = [];    
    this.imagesDeletedList = [];
    this.accountMarginsList = [];
    this.account_margin = new AccountMarginModel();
  }

  getCustomProduct(){
    this.productsStorageUserService.getCustomProduct(+this._router.snapshot.paramMap.get('id')).subscribe(item => {
      this.editableProduct = item;
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

  editProduct(image: Image){
    this.id = +image.id;
    this.edit = true;

    this.orderP = image.order;;
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
    formData.append('image', this.file, this.file.name);

    this.productsStorageUserService.uploadImage(formData)
      .subscribe(resp => {  
        if(resp.success === true) {   
        let image_added = new Image();
        image_added.order = this.orderImage;
        image_added.title = this.titleImage;
        image_added.photos = resp.reason;
        this.editableProduct.images.push(image_added);
      
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
          text: 'Su imagen excede el tamaño máximo de 2MB (Mega Byte), lea la ayuda para mas información',
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
  }

  close(){
    this.closeModal.nativeElement.click();
    this.closeModalLoading.nativeElement.click();
  }

  /** Seccion para la vista Publicar */

  updateMeliAccountListView(meliAccount: number){   
    if(meliAccount !== -1){
      var account = this.meliAccountsList.find(element => element.id == meliAccount)

      let accountMargin = new AccountMarginModel();
      accountMargin.accountName = account.businessName;
      accountMargin.idAccount = account.id;
      accountMargin.idMargin = -1;
      accountMargin.nameMargin = "";
      this.accountMarginsList.push(accountMargin);

      let index = this.meliAccountsList.indexOf(account);
      this.meliAccountsList.splice(index, 1);
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

  editRelationAccountMargin(relationship: AccountMarginModel){
    this.account_margin = relationship;    
  }

  updateRelationShip(){
    if(this.margin == -1) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `error`,
        text: `Seleccione un margen`,
        showConfirmButton: false,
        timer: 5000
      });      
    }
    else{
      let position = this.accountMarginsList.indexOf(this.account_margin);
      var margin = this.marginsList.find(element => element.id == this.margin);
      this.account_margin.idMargin = margin.id;
      this.account_margin.nameMargin = margin.name;
      this.account_margin.typeMargin = margin.type;
      this.account_margin.valueMargin = margin.value;
      this.accountMarginsList[position] = this.account_margin;     
    }
  }

  previewDelete(relationship: AccountMarginModel){
    this.account_margin = relationship;
  }

}
