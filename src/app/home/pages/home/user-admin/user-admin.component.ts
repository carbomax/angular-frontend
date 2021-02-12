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
import { RoleEnum } from '../../../../enums/role.enum';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  // Handle errors
  public loading = false;
  public errorUsers = false;
  public emptySeach = false;
  public changeMyself = false;

  // Modal
  public headerCreateModal = 'Registrar usuario';
  public headerUpdateModal = 'Actualizar usuario';
  public register = true;
  public seletedProfile: Profile;
  public profiles: Profile[] = [];
  public currentUser = '';
  public roles: Role[] = [];
  public marketplaces: Marketplace[] = [];

  // multiselect
  selectedMarketplaces = [];
  selectedRoles = [];

  // Pagination
  page = 1;
  pageSize = 5;
  public loadPaginator = false;

  constructor(public userService: UserService, public marketplaceService: MarketplaceService,
              public authService: AuthService, public router: Router) {

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

    this.errorUsers = false;
    this.seletedProfile.user.roles = this.selectedRoles;
    this.seletedProfile.marketplaces = this.selectedMarketplaces;
    if (this.seletedProfile.id == null) {
      this.loading = true;
      console.log('Saving user..')
      this.seletedProfile.marketplaces = this.selectedMarketplaces;
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

      if(this.verifyCurrentUser(this.seletedProfile)){
        Swal.fire({
          title: 'Está seguro?',
          text: 'Si actualiza sus propios datos deberá iniciar sesión!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1cc88a',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
         cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.changeMyself = true;
            this.loading = true;
            this.updateProfile();
          } else {
            this.loading = false;
          }

        })
      } else {
        this.updateProfile();
      }

    }
  }

  updateProfile(): void {
    this.seletedProfile.rut = this.seletedProfile.rut.toString();
    this.seletedProfile.marketplaces = this.selectedMarketplaces;
    this.seletedProfile.user.roles = this.selectedRoles;
    console.log(this.seletedProfile)
    this.userService.updateUserProfile(this.seletedProfile).subscribe(resp => {

      if(this.changeMyself){
        this.profiles = [];
        this.authService.logout();
        this.router.navigate(['auth/login']);
      }
      this.loading = false;
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

      let errorTitle = 'El usuario no ha sido actualizado';
      if (error.error.status === 409) {
        errorTitle = 'Ya existe un usuario con ese email';
      }
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: errorTitle,
        showConfirmButton: false,
        timer: 2000
      })
    })
  }

  deleteUserProfile(profile: Profile): void {


    Swal.fire({
      title: 'Está seguro?',
      text: 'Usted no podrá revertir esto. Tenga en cuenta que se eliminaran todas las operaciones de este usuario en el sistema!',
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
    this.selectedMarketplaces = this.seletedProfile.marketplaces;
  }

  verifyCurrentUser(profile: Profile): boolean {
    return profile.user.email === this.currentUser;
  }

  loadProfiles(): void {
    this.changeMyself = false;
    this.loading = true;
    this.errorUsers = false;
    this.userService.getProfiles().subscribe(profilesResp => {

      console.log(profilesResp)
      this.profiles = [];
      profilesResp.forEach( p => {
        p.user.roles.forEach( r => {
          if(r.name.toLowerCase() === RoleEnum.ADMIN.toLowerCase() ||
          r.name.toLowerCase() === RoleEnum.INVITED.toLowerCase() ||
          r.name.toLowerCase() === RoleEnum.OPERATOR.toLowerCase()){
            this.profiles.push(p);
          }
        })
      });
      if (this.profiles.length <= 0) {
        this.errorUsers = true;
      } else{
        this.currentUser = this.authService.authenticationDataExtrac().email;
      }

      this.loading = false;
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
      this.roles = this.roles.filter(m => m.name.toLowerCase() !== RoleEnum.SELLER.toLowerCase());

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
      title: user.enabled ? 'Habilitar usuario' : 'Deshabilitar usuario',
      text: 'Confirma la operación?',
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
            title: resp.enabled ? `El usuario ha sido habilitado` : `El usuario ha sido deshabilitado`,
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
            title: `No se pudo completar la acción, por favor intente más tarde'`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      } else {
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
      marketplaces: [],
      user: {
        id: null,
        password: '',
        roles: [],
        email: ''
      }
    }
  }
}
