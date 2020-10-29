import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MeliCategory } from 'src/app/models/meli-category.model';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';

@Component({
  selector: 'app-meli-category-path',
  templateUrl: './meli-category-path.component.html',
  styleUrls: ['./meli-category-path.component.css'] 
})
export class MeliCategoryPathComponent implements OnInit {

  @Input() home: boolean;
  @Output() pathOut: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() categorySelected: EventEmitter<string> = new EventEmitter<string>();
  pathList: string[];

  meliCategoryList: MeliCategory[]; 
  meliCategory: MeliCategory;
  subcategory: boolean = false;   

  constructor(public meliPublicationsService: MeliPublicationsService) {
    this.meliCategory = new MeliCategory();
    this.pathList = [];
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
        if(this.meliCategory.children_categories.length === 0)
            this.categorySelected.emit(this.meliCategory.id);
      }
      });
    });
    this.pathOut.emit(this.pathList);    
   
  } 
  
}
