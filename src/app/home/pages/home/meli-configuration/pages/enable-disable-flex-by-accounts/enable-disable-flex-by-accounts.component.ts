import { Component, OnInit } from '@angular/core';
import { MeliAccountService } from 'src/app/home/services/meli-account.service';
import Swal from 'sweetalert2';
import { MeliSellerAccountFlexDto } from '../../models/meli-seller-account-flex.model';

@Component({
  selector: 'app-enable-disable-flex-by-accounts',
  templateUrl: './enable-disable-flex-by-accounts.component.html',
  styleUrls: ['./enable-disable-flex-by-accounts.component.css'],
})
export class EnableDisableFlexByAccountsComponent implements OnInit {

  // Accounts array
  public accountsFlex: MeliSellerAccountFlexDto[] = [];

  // Pagination
  public pageSize = 5;
  public page = 1;
  public loading = false;

  constructor(private accountMeliService: MeliAccountService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountMeliService.getAccountsEnabledOrDisabledFlexByAdmin().subscribe(
      (resp: MeliSellerAccountFlexDto[]) => {
        this.accountsFlex = resp;
        this.loading = false;
      },
      (error) => {
        console.log('Error in getAccountsEnabledOrDisabledFlexByAdmin:', error)
        this.loading = false;
      }
       
    );
  }

  updateAccountsEnabledOrDisabledFlexByAdmin(account: MeliSellerAccountFlexDto): void {
    console.log(account);
    
    Swal.fire({
      title: !account.enabledFlex ? 'Habilitar flex' : 'Deshabilitar flex',
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
        this.accountMeliService.updateAccountsEnabledOrDisabledFlexByAdmin(account.id, account.enabledFlex).subscribe(resp => {
          console.log(resp)
          this.accountsFlex.forEach(a => {
            if (a.id === account.id) {
              a.enabledFlex = resp.enabledFlex;
            }
          });
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: resp.enabledFlex ? `Flex ha sido habilitado` : `Flex deshabilitado`,
            showConfirmButton: false,
            timer: 2000
          })
        }, error => {
          console.log(error);
          this.loading = false;
          account.enabledFlex = !account.enabledFlex;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `No se pudo completar la acción, por favor intente más tarde'`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      } else {
        account.enabledFlex = !account.enabledFlex;
      }
    })


  }

  // Paginator
  selectChangeHandler(value: number): void {
    this.loading = true;
    this.pageSize = value;
    this.loading = false;
  }
}
