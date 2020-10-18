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
  imageFailsList: string[];
  description = "";




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
          this.totalPages =  +this.pageProductsMeli.totalPages;        
          this.loadPaginator = false;
        }, error => {
          this.loading = false;
          this.errorProducts = true;
          this.loadPaginator = false;
        });           
  }

  ngOnInit(): void { 
    this.imagesList = [];   
    this.fileList = [];
    this.productsSelected = []; 
    this.disable = true;

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
        let position1 = this.productsSelected.indexOf(element);
        if(position1 === -1){
          this.productsSelected.push(element);
        }
      }
      else{
        let position = this.productsSelected.indexOf(element);
        if(position !== -1){
          this.productsSelected.splice(position, 1);
        }

      }
    });
    if(this.checkAll === false){
      this.disable = true;
    }else{
      this.disable = false;
    }
  }

  selectProduct(product: ProductCustom): void{
    let position = this.productsSelected.indexOf(product);
    if(position === -1){
      product.selected = !product.selected;
      if(product.selected === true) { 
        this.productsSelected.push(product);     
      } 
    }
    else{
      product.selected = !product.selected;      
      if(product.selected === false){
        this.productsSelected.splice(position, 1);
      }
    }
    if(product.selected === false){
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


  /* ******************************* Here begin the Component Modal to Publish Products ****************************** */
 /*
  openDialog() {



    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(PopupAddcommoninfoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
                this.saveNewCourse(data);
      }, error => this.logService.print(error, LogService.ERROR_MSG));
  }
*/
  getProductSelected(): void{
    this.pageProductsMeli.itemsMeliGrid.forEach(element => {
      if(element.selected === true){
        this.productsSelected.push(element);
      }
    });
  }

  saveCommonInfo(){
    this.imageFailsList = [];
    this.imageStoreList = [];
    var result = this.addImageList();

    if(result){
      let skuProductList = [];
      this.profileId = null;    
      this.profileId = this.authService.authenticationDataExtrac().profileId;
      this.productsSelected.forEach(element => {
        skuProductList.push(element.sku);
      });
      this.productStoreUserService.updateCommonInfo(this.profileId, this.description, skuProductList, this.imageStoreList).subscribe(result => {
        if(result.success === true){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Información almacenada`,
            text: `La información fue almacenada correctamente`,
            showConfirmButton: false,
            timer: 5000
          });
          this.clearAllImage();
          this.closeModal();
        }
        else{
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
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error en el proceso`,
          text: `Error almacenando su información. Contacte con el administrador del sistema`,
          showConfirmButton: false,
          timer: 5000
        });
      }); 
    }
    else{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error en el proceso`,
        text: `Error almacenando su información. Contacte con el administrador del sistema`,
        showConfirmButton: false,
        timer: 5000
      });
    }
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
let list = [];
    this.fileList.forEach(element => {     
      var formData: FormData = new FormData();   
      formData.append('image', element, element.name); 
      list.push(formData);          
  })

  this.productStoreUserService.uploadImageSyn(list);/*.subscribe(resp => {
    if(resp.success){
      this.imageStoreList.push(resp.reason);
    }else{
      this.imageFailsList.push(element.name);
    }                    
  },(error: any) => {
    this.imageFailsList.push(element.name);
  });  */
    
    /*.subscribe(resp => {
        if(resp.success){
          this.imageStoreList.push(resp.reason);
        }                      
    },(error: any) => {
      if(error.error.message.includes('Maximum upload size exceeded')){   
          //this.imageFailsList.push(element.name);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error`,
        text: 'La imagen {{element.name}} excede el tamaño máximo de 2MB (Mega Byte), lea la ayuda para mas información',
        showConfirmButton: false,
        timer: 5000
      });        
      }else{
      /*  this.imageFailsList.push(element.name);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error`,
          text: 'Error almacenando la imagen {{element.name}}. Contacte con el administrador',
          showConfirmButton: false,
          timer: 5000
        });     */     
   /*   }              
    });*/
      
    if(this.imageStoreList.length > 0){
      return true;
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
  }

}
