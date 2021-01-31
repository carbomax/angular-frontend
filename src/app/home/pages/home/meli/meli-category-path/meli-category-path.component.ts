import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MeliCategory } from 'src/app/models/meli-publication/meli-category.model';
import { MeliME2Category } from 'src/app/models/meli-publication/meli-me2-category';
import { MeliPathRoot } from 'src/app/models/meli-publication/meli-path-from-root.model';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';

@Component({
  selector: 'app-meli-category-path',
  templateUrl: './meli-category-path.component.html',
  styleUrls: ['./meli-category-path.component.css']
})
export class MeliCategoryPathComponent implements OnInit {

  @Input() home: boolean;
  @Output() pathOut: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() categorySelected: EventEmitter<MeliME2Category> = new EventEmitter<MeliME2Category>();
  pathList: string[];

  meliCategoryList: MeliCategory[];
  categoriesNotME2List: MeliPathRoot[];
  meliCategory: MeliCategory;
  subcategory: boolean = false;

  constructor(public meliPublicationsService: MeliPublicationsService) {
    this.meliCategory = new MeliCategory();
    this.pathList = [];
    this.categoriesNotME2List = meliPublicationsService.getCategoriesNotME2();
    meliPublicationsService.getMeliCategories().subscribe(list => {
      this.meliCategoryList = list;
    });
   }

  ngOnInit(): void {

  }

  ngOnChanges(): void{
    if(this.home === true && this.subcategory === true){
      this.meliPublicationsService.getMeliCategories().subscribe(list => {
        this.meliCategoryList = list;
      });
      this.home = false;
      this.subcategory = false;
      this.pathList = [];
      this.meliCategory = new MeliCategory();
    }
  }

  getSubCategories(idCategory: string){
    this.pathList = [];
    this.meliPublicationsService.getMeliSubCategories(idCategory).subscribe(resp => {
      this.subcategory = true;
      this.meliCategory = resp;
      this.meliCategory.path_from_root.forEach(element => {
      this.pathList.push(element.name);
      if(Object.keys(this.meliCategory).length !== 0){
        let aCategory = new MeliME2Category('-1');

        //Entra al if si la categoria es Hoja
        if(this.meliCategory.children_categories.length === 0){
            aCategory.idLastCategory = this.meliCategory.id;
            //Validar si categoria es mercado enviable segun me2 .
            if(this.meliCategory.shipping_modes.includes('me2')) {
              aCategory.isME2 = true;

            }else {
              //si la categoria o sus categorias padres son iguales a alguna categoria de la lista no deseada entonces no es Mercado enviable
              if(this.categoriesNotME2List.some(f => f.id === this.meliCategory.id || this.meliCategory.path_from_root.some(f1 => f1.id === f.id) ))
                 aCategory.isME2 = false;
               else
                 aCategory.isME2 = true;
            }
        }
        this.categorySelected.emit(aCategory);

      }
      });
    });
    this.pathOut.emit(this.pathList);

  }

}
