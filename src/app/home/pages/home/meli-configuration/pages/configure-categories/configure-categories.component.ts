import { Component, OnInit } from '@angular/core';
import { MeliPublicationsService } from 'src/app/home/services/meli-publications.service';
import Swal from 'sweetalert2';
import { AllowedCategory } from '../../models/meli-allowed-category.model';
import { MeliCategoryME2 } from '../../models/meli-category-me2.model';

@Component({
  selector: 'app-configure-categories',
  templateUrl: './configure-categories.component.html',
  styleUrls: ['./configure-categories.component.css']
})
export class ConfigureCategoriesComponent implements OnInit {

  home: boolean = false;
  pathList: string[];
  lastCategorySelected = new AllowedCategory('-1');
  categoriesAllowedList: MeliCategoryME2[] = [];

  // Pagination
  public pageSize = 5;
  public page = 1;
  public loading = false;

  constructor(public publicationsService: MeliPublicationsService) { }

  ngOnInit() {
    this.lastCategorySelected = new AllowedCategory('-1');
    this.categoriesAllowedList = [];
    this.getAllowedListCategoriesME2();
  }

   // Paginator
   selectChangeHandler(value: number): void {
    this.loading = true;
    this.pageSize = value;
    this.loading = false;
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

  getCategorySelected(category: AllowedCategory){
    this.lastCategorySelected = category;
    if(this.lastCategorySelected.idCategory !== '-1'){
      if(this.lastCategorySelected.isME2 === true ){
        Swal.fire({
          title: 'IMPORTANTE!!!',
          text: 'La categoría seleccionada es Mercado Enviable. Seleccione otra categoría para adicionar a la lista de confianza.',
          icon: 'info',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido!'
        })
      }
    }
  }

  getAllowedListCategoriesME2(): void {
    this.publicationsService.getAllowedListCategoriesME2().subscribe(allowCategories => {
      this.categoriesAllowedList = allowCategories;
    });
  }

  saveCategoryToAllowedList(category: AllowedCategory): void {
    let cat = new MeliCategoryME2(category.idCategory, category.nameCategory, category.path_from_rootCategory);
    if(this.categoriesAllowedList.some(c => c.id === cat.id )) {
      Swal.fire({
        title: 'IMPORTANTE!!!',
        text: 'La categoría seleccionada es Mercado Enviable. Seleccione otra categoría para adicionar a la lista de confianza.',
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido!'
      })
    }
    else {
      let tempListToAdd: MeliCategoryME2[] = [cat];
      this.publicationsService.saveAllowedListCategoriesME2(tempListToAdd).subscribe( response => {
        if(response.length === tempListToAdd.length) {
          Swal.fire({
            position: 'top-right',
            title: 'Guardado!!!',
            text: 'Categoría guardada satisfactoriamente.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          response.forEach(elem => this.categoriesAllowedList.push(elem));
        }
      }, (error: any) =>
      Swal.fire({
        title: 'Error!!!',
        text: 'Las categorías seleccionadas no fueron guardadas.', //ME qued'o hacer la devolucion del mensaje de error
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido!'
      }) );
    }
  }

  deleteCategoryFromAllowedList(category: MeliCategoryME2): void {
      this.publicationsService.deleteCategoryFromAllowedList(category).subscribe(response => {
        if(response === true) {
          Swal.fire({
            position: 'top-right',
            title: 'Eliminado!!!',
            text: 'La categoría seleccionada fue eliminada satisfactoriamente.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          this.getAllowedListCategoriesME2();
        }
      })


  }

}
