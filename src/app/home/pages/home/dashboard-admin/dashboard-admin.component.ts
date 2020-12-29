import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { StatisticService } from '../../../services/statistic.service';
import { StockVsTotalItemDto } from '../../../../models/statistics/stock.vs.total.item.model';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  countAllSales = 0;
  countActivePublications = 0;
  betterSku = '';
  stockVsTotal = new StockVsTotalItemDto();

  constructor(public statisticService: StatisticService){

  }
  ngOnInit(): void {
    this.getCountAllSales();
    this.getCountActivePublications();
    this.getBetterSku();
    this.getStockVsTotalOfItems();
  }

  getCountAllSales(): void{

    this.statisticService.getCountAllSales().subscribe( count => {
      console.log(count)
        this.countAllSales = count as number;
    }, error => {
      console.log('Error in getCountAllSales(): ', error);
      this.countAllSales = 0;
    })
  }

  getCountActivePublications(): void{

    this.statisticService.getCountActivePublications().subscribe( count => {
      console.log(count)
        this.countActivePublications = count as number;
    }, error => {
      console.log('Error in getCountActivePublications(): ', error);
      this.countActivePublications = 0;
    })
  }

  getBetterSku(): void{

    this.statisticService.getBetterSku().subscribe( (resp: any) => {
      console.log('Better sku', resp)
        if(resp.sku !== undefined && resp.sku !== null){
          this.betterSku = `${resp.sku} : ${resp.count}`;
        } else {
          this.betterSku = '';
        }
    }, error => {
      console.log('Error in getBetterSku(): ', error);
      this.betterSku = '';
    })
  }

  getStockVsTotalOfItems(): void{
    this.statisticService.getStockVsTotalOfItems().subscribe( dto => {
        this.stockVsTotal = dto;
    }, error => {
      console.log('Error in getStockVsTotalOfItems(): ', error);
      this.stockVsTotal.total = 0;
      this.stockVsTotal.withStock = 0;
    })
  }


  get percent(): string{
    return `${this.getPercent(this.stockVsTotal.withStock, this.stockVsTotal.total)}%`
  }
  getPercent(number1: number, number2: number): number{
      return number1 && number2 ? Math.round((number1/number2)*100) : 0;
  }
}

