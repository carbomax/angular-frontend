import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { MarketplaceType } from '../../../../../enums/marketplacetype.enum';
import { MarketplaceDetails } from '../../../../../models/marketplace.details';

declare function initializePlugin();

@Component({
  selector: 'app-choose-marketplaces',
  templateUrl: './choose-marketplaces.component.html',
  styleUrls: ['./choose-marketplaces.component.css']
})
export class ChooseMarketplacesComponent implements OnInit {
  
  marketplaceDetailsList: MarketplaceDetails[];
  marketplaceType: MarketplaceType; 

  constructor(public userService: UserService, public productsStorageUserService: ProductsStorageUserService ) {
    //Servicio para Obtener profile y poder almacenar las tarjetas que tiene habilitada
    //this.marketplaceType = Servicio    
    productsStorageUserService.getDetailsMarketplaces().subscribe(resp => this.marketplaceDetailsList = resp);   
  }

  ngOnInit(): void {  
   initializePlugin();
  }



}
