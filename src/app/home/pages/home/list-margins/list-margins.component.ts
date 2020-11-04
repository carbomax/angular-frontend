import { Component, OnInit } from '@angular/core';
import { Margin } from '../../../../models/margin';
import { MarginService } from '../../../services/margin.service';
import Swal from 'sweetalert2';
import { Marketplace } from '../../../../models/marketplace.model';
import { MarketplaceService } from '../../../services/marketplace.service';

@Component({
  selector: 'app-list-margins',
  templateUrl: './list-margins.component.html',
  styleUrls: ['./list-margins.component.css']
})
export class ListMarginsComponent implements OnInit {

  public selectedMargin: Margin = new Margin();
  public margins: Margin[] = [];
  public marketplaces: Marketplace[] = [];
  public selectedMarketplaces: Marketplace = new Marketplace();
  // Modal
  public headerCreateModal = 'Crear margen';
  public headerUpdateModal = 'Actualizar margen';
  public register = true;
  public loading = true;
  public errorMargins = false;

  // Paginator
  public loadPaginator = false;
  public page = 1;
  public pageSize = 5;

  constructor(public marginService: MarginService, public marketplaceService: MarketplaceService) {
    this.initialize();
  }

  ngOnInit(): void {
    this.loadMargins();
    this.loadMarketplaces();
  }

  loadMarketplaces(): void {
    this.marketplaceService.getMarketplaces().subscribe(marketplacesResp => {
      this.marketplaces = marketplacesResp;
      console.log(this.marketplaces);
    })
  }
  // Paginator
  selectChangeHandler(value: number): void {
    this.loading = true;
    this.pageSize = value;
    this.loading = false;

  }


  createOrUpdateMargin(): void {
    this.loading = true;
    this.errorMargins = false;
    console.log(this.selectedMarketplaces)
    if (this.selectedMargin.id) {
      console.log('update')
      this.selectedMargin.marketplaceId = this.selectedMarketplaces.id;
      this.marginService.updateMargin(this.selectedMargin).subscribe(resp => {
        this.loadMargins();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Margin ${resp.name} ha sido actualizado`,
          showConfirmButton: false,
          timer: 2000

        });
      }, error => {
        console.log(error)
        this.loading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Margin no ha sido actualizado`,
          showConfirmButton: false,
          timer: 2000
        })
      })
    } else {

      if (this.margins.map(m => m.name.toLowerCase()).includes(this.selectedMargin.name.toLowerCase())) {
        this.loading = false;
        this.errorMargins = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Ya existe un margen con ese nombre`,
          showConfirmButton: false,
          timer: 2000
        });

      } else {
        this.selectedMargin.marketplaceId = this.selectedMarketplaces.id;
        this.marginService.saveMargin(this.selectedMargin).subscribe(marginResponse => {
          console.log(marginResponse);
          this.loadMargins();
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Marketplace ${marginResponse.name} ha sido creado`,
            showConfirmButton: false,
            timer: 2000

          });
        }, error => {
          console.log(error);
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Margen no ha sido creado`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      }


    }
  }


  deleteMargin(margin: Margin): void {


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
        this.marginService.deleteMargin(margin.id).subscribe(resp => {
          console.log(resp)
          this.loading = false;
          this.loadMargins();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${margin.name} ha sido eliminado`,
            showConfirmButton: false,
            timer: 2000
          })
        }, error => {
          console.log('Error eliminando el margin:', error);
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `El margin no ha sido eliminado`,
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    })
  }


  createModal(): void {
    this.register = true;
    this.selectedMarketplaces = null;
    this.initialize();
  }

  updateModal(margin: Margin): void {
    console.log(margin)
    this.selectedMargin = margin;
    this.selectedMarketplaces = margin.marketplace;
    console.log(this.selectedMarketplaces)
    this.register = false;
  }





  loadMargins(): void {
    this.loading = true;
    this.marginService.getMargins().subscribe(marginsResp => {
      this.margins = marginsResp;
      if (this.margins.length === 0) {
        this.errorMargins = true;
      }
      this.loading = false;
    }, error => {
      console.log('Error:', error);
      this.loading = false;
      this.errorMargins = true;
    });
  }

  initialize(): void {
    this.selectedMargin = {
      name: '',
      type: 2,
      marketplaceId: 0,
      value: 25
    }

  }

}
