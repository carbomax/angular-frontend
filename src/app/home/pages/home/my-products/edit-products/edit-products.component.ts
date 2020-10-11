import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
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

  productsDeletedList: number[];
  editableProduct: EditableProductModel; 
  imageToDelete: Image;
  edit = false;  
  
  id: number = -1;
  public urlP = "";
  public titleP: string;
  public orderP: number = -1;

  constructor(private _router: ActivatedRoute, public productsStorageUserService: ProductsStorageUserService ) { }

  ngOnInit(): void {
    this.getCustomProduct();
    this.productsDeletedList = [];  
    this.titleP = "dsdfsdf";  
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
      /*let position = this.editableProduct.images.indexOf(image);
      this.editableProduct.images[position].order = image.order;
      this.editableProduct.images[position].title = image.title;
      this.editableProduct.images[position].photos = image.photos;  */
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

}
