import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from '../../../services/user.service';
import { MarketplaceService } from '../../../services/marketplace.service';

// Models
import { Profile } from '../../../../models/profile.model';
import { Marketplace } from '../../../../models/marketplace.model';
import { Role } from '../../../../models/role.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  // Handle errors
  public loading = false;
  public errorUsers = false;
  public emptySeach = false;

  // Modal
  public headerCreateModal = 'Registrar usuario';
  public headerUpdateModal = 'Actualizar usuario';
  public register = true;
  public seletedProfile: Profile;
  public profiles: Profile[] = [];
  public roles: Role[] = [];
  public marketplaces: Marketplace[] = [];

  // multiselect
  selectedMarketplaces = [];
  selectedRoles = [];

  constructor(public userService: UserService, public marketplaceService: MarketplaceService) {
    this.initProfile();
  }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadRoles();
    this.loadMarketplaces();
  }



  createOrUpdateUser(): void {
    this.loading = true;
    this.errorUsers = false;
    this.seletedProfile.user.roles = this.selectedRoles;
    this.seletedProfile.user.marketplaces = this.selectedMarketplaces;
    console.log(this.seletedProfile)
    if(this.seletedProfile.id == null){
      console.log('Saving user..')
      this.seletedProfile.user.marketplaces = this.selectedMarketplaces;
      this.seletedProfile.user.roles = this.selectedRoles;
      this.userService.saveUserProfile(this.seletedProfile).subscribe( resp => {
        this.loadProfiles();
        if(!this.profiles){
          this.errorUsers = true;
        }

        console.log(resp)
      })
    } else {
      console.log('Updating user..')
    }
  }

  createModal(): void {
    console.log(this.selectedMarketplaces)
    console.log(this.selectedRoles)
    this.register = true;
    this.initProfile();
    this.selectedRoles = []
    this.selectedMarketplaces = []
  }
  updateModal(profile: Profile): void {
    this.register = false;
    this.seletedProfile = profile;
    this.selectedRoles = this.seletedProfile.user.roles;
    this.selectedMarketplaces = this.seletedProfile.user.marketplaces;
  }

  loadProfiles(): void {
    this.loading = true;
    this.userService.getProfiles().subscribe(profilesResp => {
      this.profiles = profilesResp;
      this.loading = false;
      console.log(this.profiles);
    },
    ( error: any) => {
      this.loading = false;
      this.errorUsers = true;
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(rolesResp => {
      this.roles = rolesResp;
      console.log(this.roles);
    });

  }

  loadMarketplaces(): void {
    this.marketplaceService.getMarketplaces().subscribe(marketplacesResp => {
      this.marketplaces = marketplacesResp;
      console.log(this.marketplaces);
    })
  }

  initProfile(): void {
    this.seletedProfile = {
      id: null,
      firstName: '',
      lastName: '',
      user: {
        id: null,
        password: '',
        marketplaces: [],
        roles: [],
        email: ''
      }
    }
  }
}
