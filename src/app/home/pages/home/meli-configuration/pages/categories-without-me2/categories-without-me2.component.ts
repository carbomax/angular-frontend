import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeliPublicationsService } from 'src/app/home/services/meli-publications.service';
import { MeliCategory } from 'src/app/models/meli-publication/meli-category.model';
import { AllowedCategory } from '../../models/meli-allowed-category.model';
import { MeliCategoryME2 } from '../../models/meli-category-me2.model';

@Component({
  selector: 'app-categories-without-me2',
  templateUrl: './categories-without-me2.component.html',
  styleUrls: ['./categories-without-me2.component.css']
})
export class CategoriesWithoutMe2Component implements OnInit {


  @Input() home: boolean;
  @Output() pathOut: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() categorySelected: EventEmitter<AllowedCategory> = new EventEmitter<AllowedCategory>();
  pathList: string[];

  meliCategoryList: MeliCategory[];
  categoriesME2AllowedList: MeliCategoryME2[];
  meliCategory: MeliCategory;
  subcategory: boolean = false;

  constructor(public meliPublicationsService: MeliPublicationsService) {
    this.meliCategory = new MeliCategory();
    this.pathList = [];
    meliPublicationsService.getAllowedListCategoriesME2().subscribe(list => this.categoriesME2AllowedList = list);
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
    this.meliPublicationsService.getAllowedListCategoriesME2().subscribe(list => this.categoriesME2AllowedList = list); //Actualiza la lista de categorias permitidas
    this.pathList = [];
    this.meliPublicationsService.getMeliSubCategories(idCategory).subscribe(resp => {
      this.subcategory = true;
      this.meliCategory = resp;
      this.meliCategory.path_from_root.forEach(element => {
        this.pathList.push(element.name);
      });
      if(Object.keys(this.meliCategory).length !== 0){
        let aCategory = new AllowedCategory('-1'); // (-1) no es hoja

        //Entra al if si la categoria es Hoja
        if(this.meliCategory.children_categories.length === 0){
            aCategory.idCategory = this.meliCategory.id;
            aCategory.nameCategory = this.meliCategory.name;
            this.pathList.forEach( element => {
              if(aCategory.path_from_rootCategory === undefined)
                aCategory.path_from_rootCategory = element;
              else
                aCategory.path_from_rootCategory += " >> " + element;
            } );

            //Validar si categoria es mercado enviable segun me2 .
            if(this.meliCategory.shipping_modes.includes('me2')) {
              aCategory.isME2 = true;
            }else {
              //si la categoria es igual a alguna categoria de la lista de confianza entonces es Mercado enviable
              if(this.categoriesME2AllowedList.some(f => f.id === this.meliCategory.id ))
                 aCategory.isME2 = true;
              else
                 aCategory.isME2 = false;
            }
        }
        this.categorySelected.emit(aCategory);

      }
    });
    this.pathOut.emit(this.pathList);

  }

}
