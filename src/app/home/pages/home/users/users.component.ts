import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from '../../../services/user.service';
import { MarketplaceService } from '../../../services/marketplace.service';

// Models
import { Profile } from '../../../../models/profile.model';
import { Marketplace } from '../../../../models/marketplace.model';
import { Role } from '../../../../models/role.model';
import Swal from 'sweetalert2';
import { User } from '../../../../models/user.model';

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

  //Pagination
  page = 1;
  pageSize = 5;
  public loadPaginator = false;

  constructor(public userService: UserService, public marketplaceService: MarketplaceService) {
    this.initProfile();
  }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadRoles();
    this.loadMarketplaces();
  }

  // Paginator
  selectChangeHandler(value: number): void {
    this.loadPaginator = true;
    this.pageSize = value;
    this.loadPaginator = false;
  }

  createOrUpdateUser(): void {
    this.loading = true;
    this.errorUsers = false;
    this.seletedProfile.user.roles = this.selectedRoles;
    this.seletedProfile.user.marketplaces = this.selectedMarketplaces;
    if (this.seletedProfile.id == null) {
      console.log('Saving user..')
      this.seletedProfile.user.marketplaces = this.selectedMarketplaces;
      this.seletedProfile.user.roles = this.selectedRoles;
      this.userService.saveUserProfile(this.seletedProfile).subscribe(resp => {
        this.loadProfiles();
        if (!this.profiles) {
          this.errorUsers = true;
        }

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Usuario ${resp.firstName} ha sido creado`,
          showConfirmButton: false,
          timer: 2000
        })
      }, (error: any) => {
        this.loading = false;
        let errorTitle = 'El usuario no ha sido creado';
        if (error.error.status === 409) {
          errorTitle = 'Ya existe un usuario con ese email';
        }
        console.log('Error creando el usuario:', error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: errorTitle,
          showConfirmButton: false,
          timer: 2000
        })
      })
    } else {
      this.seletedProfile.rut = this.seletedProfile.rut.toString();
      this.seletedProfile.user.marketplaces = this.selectedMarketplaces;
      this.seletedProfile.user.roles = this.selectedRoles;
      console.log(this.seletedProfile)
      this.userService.updateUserProfile(this.seletedProfile).subscribe(resp => {

        this.loadProfiles();
        this.seletedProfile = resp;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Usuario ${this.seletedProfile.firstName} ha sido actualizado`,
          showConfirmButton: false,
          timer: 2000

        })
      }, error => {
        console.log('Error al actualizar un usuario', error);
        this.loadProfiles();
        this.loading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `El usuraio no ha sido actualizado`,
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }


  deleteUserProfile(profile: Profile): void {


    Swal.fire({
      title: 'Está seguro?',
      text: "Usted no podrá revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        console.log('delete')
        this.userService.deleteUserProfile(profile.user.id).subscribe(resp => {
          console.log(resp)
          this.loadProfiles();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `El usuario ${profile.firstName} ha sido eliminado`,
            showConfirmButton: false,
            timer: 2000
          })
        }, error => {
          console.log('Error eliminando el user:', error);
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `El usuario no ha sido eliminado`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    })



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
    this.errorUsers = false;
    this.userService.getProfiles().subscribe(profilesResp => {
      this.profiles = profilesResp;
      this.loading = false;
      if (!this.profiles.length) {
        this.errorUsers = true;
      }
      console.log(this.profiles);
    },
      (error: any) => {
        this.loading = false;
        this.errorUsers = true;
        this.profiles = null;
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

  enabledOrDisabled(user: User): void {
    Swal.fire({
      title: 'Habilitar usuario',
      text: "Confirma la operación?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.userService.enabledOrDisable(user.id, user.enabled).subscribe(resp => {
          console.log(resp)
          this.profiles.forEach(p => {
            if (p.user.id === user.id) {
              p.user.enabled = resp.enabled;
            }
          });
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `El usuario ha sido habilitado`,
            showConfirmButton: false,
            timer: 2000
          })
        }, error => {
          console.log(error);
          this.loading = false;
          user.enabled = !user.enabled;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `El usuario no ha sido habilitado`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      } else{
        user.enabled = !user.enabled;
      }
    })




  }

  initProfile(): void {
    this.seletedProfile = {
      id: null,
      firstName: '',
      lastName: '',
      businessName: '',
      enabled: false,
      rut: '',
      address: '',
      store: '',
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
