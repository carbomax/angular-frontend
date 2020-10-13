import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import Swal from 'sweetalert2';
import { EditableProductModel } from '../../../../../models/editable.product.model';
import { Image } from '../../../../../models/image.model';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {  
  @ViewChild('closeModal') closeModal;

  productsDeletedList: number[];
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

  constructor(private _router: ActivatedRoute, public productsStorageUserService: ProductsStorageUserService ) { }

  ngOnInit(): void {
    this.getCustomProduct();
    this.productsDeletedList = [];    
   
  }

  getCustomProduct(){
    this.productsStorageUserService.getCustomProduct(+this._router.snapshot.paramMap.get('id')).subscribe(item => {
      this.editableProduct = item;
    });
  }

  saveForm(){
    this.productsStorageUserService.updateCustomProduct(this.editableProduct, this.productsDeletedList).subscribe(item => {      
      this.editableProduct = item;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Actualizado`,
        text: `Sus productos han sido actualizados correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });
    },(error: any) => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error`,
        text: `Error al actualizar. Sincronice sus productos.`,
        showConfirmButton: false,
        timer: 5000
      });

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

  deleteProduct(){
    this.productsDeletedList.push(this.imageToDelete.id); 
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
        let image_added = new Image();
        image_added.order = this.orderImage;
        image_added.title = this.titleImage;
        image_added.photos = resp;
        this.editableProduct.images.push(image_added);
      
        this.clearImage();   
        
      },(error: any) => {
        if(error.status >= 200 && error.status <= 299)
        {
          let image_added = new Image();
          image_added.order = this.orderImage;
          image_added.title = this.titleImage;
          image_added.photos = error.message;
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
  }

}
