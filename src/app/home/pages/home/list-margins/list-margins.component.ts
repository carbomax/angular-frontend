import { Component, OnInit } from '@angular/core';
import { Margin } from '../../../../models/margin';
import { MarginService } from '../../../services/margin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-margins',
  templateUrl: './list-margins.component.html',
  styleUrls: ['./list-margins.component.css']
})
export class ListMarginsComponent implements OnInit {

  public selectedMargin: Margin = new Margin();
  public margins: Margin[] = [];

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

  constructor(public marginService: MarginService) {
    this.initialize();
  }

  ngOnInit(): void {
    this.loadMargins();
  }

   // Paginator
   selectChangeHandler(value: number): void {
    this.loadPaginator = true;
    this.pageSize = value;
    this.loadPaginator = false;
  }


  createOrUpdateMargin(): void {
    this.loading = true;
    if (this.selectedMargin.id) {
      console.log('update')
      this.marginService.updateMargin(this.selectedMargin, 1).subscribe(resp => {
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
      this.marginService.saveMargin(this.selectedMargin, 1).subscribe(marginResponse => {
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
          title: `Marketplace no ha sido creado`,
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }


  deleteMargin(margin: Margin): void {


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
    this.initialize();
  }

  updateModal(margin: Margin): void {
    this.selectedMargin = margin;
    this.register = false;
  }





  loadMargins(): void {
    this.loading = true;
    this.marginService.getMargins().subscribe(marginsResp => {
      this.margins = marginsResp;
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
      value: 25
    }
  }

}
