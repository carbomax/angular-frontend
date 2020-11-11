import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-popup-addcommoninfo',
  templateUrl: './popup-addcommoninfo.component.html',
  styleUrls: ['./popup-addcommoninfo.component.css']
})
export class PopupAddcommoninfoComponent implements OnInit {

  

  message: string;
  file: any;
  imagePath: string;
  imgURL: any;
  imagesList: string[];
  
  description = "";

  constructor() { }

  ngOnInit(): void {
    this.imagesList = [];   
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
      this.imagesList.push(this.imgURL);
      this.message = "";
      this.file = files[0];      
    }

  }

  deleteImage(image){

    this.imagesList.forEach(element => {
      if(element === image){
        let position = this.imagesList.indexOf(image);
        this.imagesList.splice(position, 1);
      }
    })
  }

  saveImageList(){

  }

}
