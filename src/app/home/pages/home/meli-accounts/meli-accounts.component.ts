import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { timeInterval } from 'rxjs/operators';
import { ProductsStorageService } from 'src/app/home/services/products-storage.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { MeliAccount } from '../../../../models/meli.account';
import { MeliAccountService } from '../../../services/meli-account.service';

@Component({
  selector: 'app-meli-accounts',
  templateUrl: './meli-accounts.component.html',
  styleUrls: ['./meli-accounts.component.css']
})
export class MeliAccountsComponent implements OnInit {



  // Handle errors
  public loading = false;
  public loadingSynchronization = false;
  public errorUsers = false;
  public emptySeach = false;
  public changeMyself = false;
  public descriptionStatusAccount = '';
  display = 'none';


  // Modal
  public headerCreateModal = 'Registrar cuenta';
  public headerUpdateModal = 'Actualizar cuenta';
  public register = true;

  // Accounts
  selectedMeliAccount: MeliAccount = new MeliAccount();
  meliAccounts: MeliAccount[] = [];

  // Pagination
  page = 1;
  pageSize = 5;
  public loadPaginator = false;

  errorTitleMessageAuthorization = 'Autorización';
  errorTitleMessageSyncronization = 'Sincronización';
  errorbodyMessageAuthorization = 'Su código de autorización o token de actualización puede estar vencido o ya se usó. Por favor póngase en contacto con el administrador';
  errorbodyMessagePepegangaAuthorization = 'Estamos teniendo problemas al sincronizar su cuenta con mercado libre. Por favor intente de nuevo o póngase en contacto con el administrador';





  routerEvent: Observable<Event>;
  constructor(public authService: AuthService,
    public meliAccountService: MeliAccountService,
    public router: Router,
    public activateRouter: ActivatedRoute) {

    this.activateRouter.queryParamMap.subscribe((resp: any) => {
      console.log(resp.params.code)
      const code = resp.params.code;

      if (code && this.meliAccountService.getAccountReference()) {
        // Activamos el loading y vamos chequeando cada uno de los estados de la cuenta
        // 0-No vinculada, 1-Autorizada, 2-Vinculada

        this.loadingSynchronization = true;
        this.descriptionStatusAccount = 'Sincronizando cuenta...';
        const reference = this.meliAccountService.getAccountStorageReference();
        this.meliAccountService.clearAccountStorage();
        this.authorizeAccount(reference, code);
      }
    })




  }

  public authorizeAccount(accountReference, code): void {
    this.meliAccountService.authorizeAccount(accountReference, code).subscribe(respAuthorize => {
      console.log(respAuthorize)
      console.log('Cuenta autorizada')
      this.loadingSynchronization = true;
      this.descriptionStatusAccount = 'Autorizando cuenta...';
      if (respAuthorize.userId) {
        this.synchronizeAccount(respAuthorize.id);
      }
    }, (error: any) => {
      console.log(error)
      this.loadingSynchronization = false;
      this.meliAccountService.clearAccountStorage();

      if (error.error_meli) {
        console.log('meli-error', error);
        this.errorMessageNotification(this.errorTitleMessageAuthorization, this.errorbodyMessageAuthorization, 'warning');
      } else if (error.error) {
        console.log('pepeganga-error', error);
        this.errorMessageNotification(this.errorTitleMessageAuthorization, this.errorbodyMessagePepegangaAuthorization, 'warning');
      } else {
        this.errorMessageNotification('Error', 'Estamos teniendo problemas en el servidor, por favor intente más tarde', 'warning');
      }

    })

  }

  errorMessageNotification(title, body, type): void {
    Swal.fire({
      position: 'top-end',
      icon: type,
      title,
      text: body,
      showConfirmButton: true
    })
  }

  synchronizeAccount(id): void {
    this.meliAccountService.synchronizeAccount(id).subscribe(resp => {
      console.log(resp)
      console.log('Cuenta vinculada')
      this.descriptionStatusAccount = 'Cuenta vinculada satisfactoriamente...';
      this.meliAccountService.clearAccountStorage();
      setTimeout(() => {
        this.loadAcounts();
        this.loadingSynchronization = false;
      }, 2000);
    }, (error: any) => {
      console.log(error)
      this.loadingSynchronization = false;
      this.meliAccountService.clearAccountStorage();

      if (error.error_meli) {
        console.log('meli-error', error);
        this.errorMessageNotification(this.errorTitleMessageSyncronization, this.errorbodyMessageAuthorization, 'warning');
      } else if (error.error) {
        console.log('pepeganga-error', error);
        this.errorMessageNotification(this.errorTitleMessageAuthorization, this.errorbodyMessagePepegangaAuthorization, 'warning');
      } else {
        this.errorMessageNotification('Error', 'Estamos teniendo problemas en el servidor, por favor intente más tarde', 'warning');
      }
    });
  }

  ngOnInit(): void {

    this.loadAcounts();
  }

  redirect(id: number): void {
    this.meliAccountService.redirectToMeli(id);
  }

  // Paginator
  selectChangeHandler(value: number): void {
    this.loadPaginator = true;
    this.pageSize = value;
    this.loadPaginator = false;
  }

  createOrUpdateAccount(): void {
    this.loading = true;
    if (this.selectedMeliAccount.id == null) {
      console.log('Saving account..')
      this.meliAccountService.saveAccountByProfile(this.selectedMeliAccount).subscribe(resp => {
        this.loadAcounts();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Cuenta ${this.selectedMeliAccount.businessName} ha sido creada`,
          showConfirmButton: false,
          timer: 2000
        })
      }, (error: any) => {
        this.loading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'La cuenta no ha sido creada',
          showConfirmButton: false,
          timer: 2000
        })
      })
    } else {

      console.log(this.selectedMeliAccount)
      this.meliAccountService.updateAccount(this.selectedMeliAccount).subscribe(resp => {

        this.selectedMeliAccount = resp;
        this.loadAcounts();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Cuenta ${this.selectedMeliAccount.businessName} ha sido actualizada`,
          showConfirmButton: false,
          timer: 2000

        })

      }, error => {
        console.log('Error al actualizar la cuenta', error);
        this.loadAcounts();
        this.loading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `La cuenta no ha sido actualizada`,
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }

  deleteAccount(account: MeliAccount): void {


    Swal.fire({
      title: 'Está seguro?',
      text: 'Usted no podrá revertir esto!',
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
        this.meliAccountService.deleteAccount(account.id).subscribe(resp => {
          console.log(resp)
          this.loadAcounts();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `La cuenta ${account.businessName} ha sido eliminada`,
            showConfirmButton: false,
            timer: 2000
          })
        }, error => {
          console.log('Error eliminando la cuenta:', error);
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `La cuenta no ha sido eliminada`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    })



  }




  createModal(): void {

    this.register = true;
    this.selectedMeliAccount = new MeliAccount();

  }
  updateModal(account): void {
    this.register = false;
    this.selectedMeliAccount = account;
  }



  loadAcounts(): void {
    this.loading = true;
    this.meliAccountService.getAccounts().subscribe((accounts: MeliAccount[]) => {
      this.meliAccounts = accounts;
      console.log(this.meliAccounts);
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  initAccount(): void {
    this.selectedMeliAccount = {
      id: null,
      businessName: '',
      businessDescription: '',
      points: 0,
      status: 0
    }
  }


}
