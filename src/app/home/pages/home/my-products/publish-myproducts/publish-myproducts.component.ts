import { Component, OnInit, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PageProductMeliStorage } from 'src/app/models/page.myproduct.custom.model';
import { ProductCustom } from 'src/app/models/myproducts.custom.model';
import { Options, LabelType } from 'ng5-slider';

import { ProductsStorageService } from '../../../../services/products-storage.service';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { AuthService } from 'src/app/core/services/auth.service';

import { PaginationInstance } from 'ngx-pagination';
import {MatDialog, MatDialogModule, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PopupAddcommoninfoComponent } from '../../../../components/modals/popup-addcommoninfo/popup-addcommoninfo.component';
import { States } from 'src/app/enums/states.enum';

declare function initializePlugin();

@Component({
  selector: 'app-publish-myproducts',
  templateUrl: './publish-myproducts.component.html',
  styleUrls: ['./publish-myproducts.component.css']
})
export class PublishMyproductsComponent implements OnInit {

  @ViewChild('closeModal') closeModal;
  @ViewChild('closeModalLoading') closeModalLoading;
  @ViewChild('checkAllP') checkAllP;

  //Loading Modal
  loadingModal = false; 

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
  productsSelected: string[];
  disable: boolean = true;
  
  //security
  profileId: number;
  
  // Paginator
  totalPages:number;
  currentPage:number = 1;
  selectedPage = 0;
  page = 0;
  size:number = 5;
  checkAll = false;
  sizes: [{ numer: 5 }, { numer: 10 }, { numer: 20 }, { numer: 30 }];

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

  constructor(public productStoreService: ProductsStorageService, public productStoreUserService: ProductsStorageUserService, public dialog: MatDialog, 
    private authService: AuthService, private router: Router) { 
    
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
          //this.totalPages =  +this.pageProductsMeli.totalPages;           
          var countSelected = 0;
          this.pageProductsMeli.itemsMeliGrid.forEach(element => {
            this.productsSelected.forEach(select => {
              if(element.sku === select){
                element.selected = true;
                countSelected++;
              }
            });          
          }); 
          if(countSelected === this.size){
            this.checkAll = true;
            this.checkAllP.nativeElement.checked = 1;
          }
          else{
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
    this.loadingModal = false;
    this.imagesList = [];   
    this.fileList = [];
    this.productsSelected = []; 
    this.disable = true;
    this.imageStoreList = [];
    
    this.pathList = [];
    

    if(this.authService.isAuthenticated)
    { 
      this.profileId = null; 
      this.profileId = this.authService.authenticationDataExtrac().profileId;
      this.loading = true;    
      this.errorProducts = false;
      this.productStoreUserService.getPageMyCustomProducts(this.profileId, 0, this.size, this.skuSearch, this.nameSeach, this.typeStateSearch === '' ? -1 : +this.typeStateSearch, this.typeFamilySearch === '' ? -1 : +this.typeFamilySearch, this.minValue, this.maxValue)
        .subscribe(pageItemCustomGrid => {        
          this.pageProductsMeli = this.productStoreUserService.pageProductsMeli; 
          this.totalPages =  +this.pageProductsMeli.totalPages;                
          if (this.pageProductsMeli.itemsMeliGrid.length <= 0) {
            this.errorProducts = true;
          }
          this.loading = false;
        }, (error: any) => {
          this.errorProducts = true;
          this.loading = false;
        })
    }
    else{
      this.router.navigate(['auth/login']);
    }
  }

  selectAllProducts():void {
    this.checkAll = !this.checkAll;

    this.pageProductsMeli.itemsMeliGrid.forEach(element => {
      element.selected = this.checkAll;
      if(element.selected === true) {
        let position1 = this.productsSelected.indexOf(element.sku);
        if(position1 === -1){
          this.productsSelected.push(element.sku);
        }
      }
      else{
        let position = this.productsSelected.indexOf(element.sku);
        if(position !== -1){
          this.productsSelected.splice(position, 1);
        }
      }
    });
    if(this.productsSelected.length === 0){
      this.disable = true;
    }else{
      this.disable = false;
    }
  }

  selectProduct(product: ProductCustom): void{
    let position = this.productsSelected.indexOf(product.sku);
    if(position === -1){
      product.selected = !product.selected;
      if(product.selected === true) { 
        this.productsSelected.push(product.sku);     
      } 
    }
    else{
      product.selected = !product.selected;      
      if(product.selected === false){
        this.productsSelected.splice(position, 1);
      }
    }
    if(this.productsSelected.length === 0){
      this.disable = true;      
    }else{
      this.disable = false;
    }
  }

  /* ********************  Here begin the searching ************************** */
  searchProducts(): void {

    if(this.authService.isAuthenticated)
    { 
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
        this.totalPages =  +this.pageProductsMeli.totalPages;  
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
    else{
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
        this.totalPages =  +this.pageProductsMeli.totalPages;  
        if (this.pageProductsMeli.itemsMeliGrid.length > 0) {
          this.empySearch = false;
        }
        this.loadingClear = false;
      }, (error: any) => {
        this.loadingClear = false;

      });

  }

  saveCommonInfo(){
    this.loadingModal = true;
    this.imageStoreList = []; 
    if(this.productsSelected.length === 0)
    {            
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

    if ( this.fileList.length !== 0) {  
      this.fileList.forEach(ima =>{
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
    
   if(this.fileList.length !== 0)
   { 
    this.productStoreUserService.uploadImageSyn(this.fileList).then(data => {     
      let resultList = data;
      resultList.forEach(element => {
        if(element.success === true){
          this.imageStoreList.push(element.reason);
        }
        else{
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
      if(resultList.length === this.imageStoreList.length){
        this.updateInDataBaseCommonInfo();             
      }else{
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
    },error => {
      this.closeActiveModalLoading(); 
      if(error.error.message.includes('Maximum upload size exceeded')){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error en el proceso`,
          text: 'Su imagen excede el tamaño máximo permitido de 2MB (Mega Byte).',
          showConfirmButton: false,
          timer: 5000
        });
      }else{      
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
   }else if(this.description.length !== 0){
      this.updateInDataBaseCommonInfo();
    }
    else{         
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

  updateInDataBaseCommonInfo(){
    this.profileId = null;    
    this.profileId = this.authService.authenticationDataExtrac().profileId; 

    this.productStoreUserService.updateCommonInfo(this.profileId, this.description, this.productsSelected, this.imageStoreList).subscribe(result => {
      if(result.success === true){   
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
      else{
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
    },error => {
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

  /* ************* Modal View Upload Images ********** */
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
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      this.imagesList.push(this.imgURL);
      this.message = "";
      this.fileList.push(files[0]);      
    }

  }

  deleteImage(image){

    this.imagesList.forEach(element => {
      if(element === image){
        let position = this.imagesList.indexOf(image);
        //elimino de la lista de rutas
        this.imagesList.splice(position, 1);
        
        //elimino de la lista de imagenes (byte)
        var reader = new FileReader();
        this.fileList.forEach(element1 => {
          reader.readAsDataURL(element1);
          reader.onload = (_event) => { 
            let url = reader.result; 
            if(url === image){
              let position1 = this.fileList.indexOf(element1);
              this.fileList.splice(position1, 1);
            } 
          }
        });
      }
    })
  }

  addImageList() {
    if ( this.fileList.length !== 0) {  
      this.fileList.forEach(ima =>{
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

  clearAllImage(){
    this.message= "";  
    this.fileList = [];   
    this.imagesList = [];
    this.imageStoreList = [];
    this.description = "";
  }

  close(){
    this.closeModal.nativeElement.click();
    this.closeModalLoading.nativeElement.click();
  }

  closeActiveModalLoading(){    
    this.loadingModal = false;
    this.closeModalLoading.nativeElement.click(); 
    //this.closeModalLoading.nativeElement.modal('hide');
  }

getPath(pathList: string[]){
  this.pathList = [];
  this.pathList = pathList;
  this.home = false;
}

setHome(){
  this.home = true;
  this.pathList = [];
}

}
