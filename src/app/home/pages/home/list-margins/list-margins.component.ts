import { Component, OnInit } from '@angular/core';
import { Margin } from '../../../../models/margin';
import { MarginService } from '../../../services/margin.service';

@Component({
  selector: 'app-list-margins',
  templateUrl: './list-margins.component.html',
  styleUrls: ['./list-margins.component.css']
})
export class ListMarginsComponent implements OnInit {

  public selectedMargin: Margin = new Margin();
  public margins: Margin[] = [];

  // Modal
  public headerCreateModal = 'Crear marketplace';
  public headerUpdateModal = 'Actualizar marketplace';
  public nameMarketplace = '';
  public idMarketplace = '';
  public register = true;
  public loading = true;
  public errorMargins = false;

  constructor(public marginService: MarginService) {
    this.initialize();
  }

  ngOnInit(): void {
    this.loadMargins();
  }

  createOrUpdateMarketplace(): void{

  }

  loadMargins(): void {
    this.marginService.getMargins().subscribe( marginsResp => {
      this.margins = marginsResp;
    }, error => {
      console.log('Error:', error);
      this.loading = false;
      this.errorMargins = true;
    });
  }

  initialize(): void {
    this.selectedMargin = {
      name: '',
      type: 0
    }
  }

}
