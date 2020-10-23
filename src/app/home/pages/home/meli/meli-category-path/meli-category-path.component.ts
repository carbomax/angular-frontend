import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MeliCategory } from 'src/app/models/meli-category.model';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';

@Component({
  selector: 'app-meli-category-path',
  templateUrl: './meli-category-path.component.html',
  styleUrls: ['./meli-category-path.component.css'] 
})
export class MeliCategoryPathComponent implements OnInit {

  meliCategoryList: MeliCategory[]; 
  meliCategory: MeliCategory;
  subcategory: boolean = false;

  constructor(public meliPublicationsService: MeliPublicationsService) {
    this.meliCategory = new MeliCategory();
    meliPublicationsService.getMeliCategories().subscribe(list => {
      this.meliCategoryList = list;     
    });   
   }

  ngOnInit(): void {
    
  }

  getSubCategories(idCategory: string){    
    this.meliPublicationsService.getMeliSubCategories(idCategory).subscribe(resp => {
      this.subcategory = true;
      this.meliCategory = resp;
    });
  }
  
}
