import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
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

  public loading = false;
  marketplaceDetailsList: MarketplaceDetails[];
  marketplaceType: MarketplaceType;
  profileId: number;

  constructor(public userService: UserService, public productsStorageUserService: ProductsStorageUserService, private authService: AuthService, private router: Router ) {

    if(this.authService.isAuthenticated)
    {
      this.loading = true;
      this.profileId = this.authService.authenticationDataExtrac().profileId;
      productsStorageUserService.getDetailsMarketplaces(this.profileId).subscribe(resp => {
        this.loading = false;
        this.marketplaceDetailsList = resp;
      }, error => { console.log(error);  this.loading = false; });

    }
    else{
      this.router.navigate(['auth/login']);
    }
  }

  ngOnInit(): void {
   initializePlugin();
  }



}
