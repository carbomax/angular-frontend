import { Component, OnInit } from '@angular/core';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MeliAccount } from '../../../../../models/meli.account';
import { StatisticService } from '../../../../services/statistic.service';
import { CountPaidAndCancellerSalesDto } from '../../../../../models/statistics/count.all.sales.model';
import { BetterSkuDto } from '../../../../../models/statistics/better.sku.model';
import { StockVsTotalItemDto } from '../../../../../models/statistics/stock.vs.total.item.model';

@Component({
  selector: 'app-dashboard-seller',
  templateUrl: './dashboard-seller.component.html',
  styleUrls: ['./dashboard-seller.component.css']
})
export class DashboardSellerComponent implements OnInit {

  //Temporal value because can be several accounts
  currentAccount: MeliAccount = new  MeliAccount();

  // Total sales
  hiddenSellChart = true;
  countAllSalesPaid = 0;
  countAllSalesCancelled = 0;


  // Better and Betters sku
  betterSku = '';
  bettersSku: BetterSkuDto[] = [];
  loadingBettersSku = false;
  // paginator
  page = 1;
  pageSize = 10;

  // Stock Vs Total
  stockVsTotal = new StockVsTotalItemDto();

  // Active Publications
  countActivePublications = 0;

  constructor(private accountService: MeliAccountService,
              private statisticService: StatisticService) { }

  ngOnInit(): void {

    this.getStockVsTotalOfItems();
    this.currentAccountPromise()
    .then( accounts => {
      this.currentAccount = accounts[0];
      if(this.currentAccount.userIdBss){
        console.log('Temporal loggin', this.currentAccount.userIdBss)
        
        this.getCountAllSales();
        this.getBetterSku();
        this.getCountActivePublications();       
      } else {
        this.reset();
      }
    })
    .catch(error => {
      console.log(error);
      this.reset();
    })
  }


  getCountAllSales(): void {

    this.statisticService.getCountAllSales(this.currentAccount.userIdBss).subscribe((count: CountPaidAndCancellerSalesDto) => {
      console.log(count)
      this.countAllSalesPaid = count.paid;
      this.countAllSalesCancelled = count.cancelled;
    }, error => {
      console.log('Error in getCountAllSales(): ', error);
      this.countAllSalesPaid = 0;
      this.countAllSalesCancelled = 0;
    })
  }

  getBetterSku(): void {

    this.statisticService.getBetterSku(this.currentAccount.userIdBss).subscribe((resp: any) => {
      console.log('Better sku', resp)
      if (resp?.sku) {
        this.betterSku = `${resp.sku} : ${resp.count}`;
      } else {
        this.betterSku = '';
      }
    }, error => {
      console.log('Error in getBetterSku(): ', error);
      this.betterSku = '';
    })
  }

  openBetterSkuModal() {
    this.currentAccount?.userIdBss ? this.getBettersSku() : null;
   
  }

  getBettersSku(): void {
    this.loadingBettersSku = true;
    this.statisticService.getBettersSku(100, this.currentAccount.userIdBss).subscribe((resp: BetterSkuDto[]) => {
      console.log('Betters sku', resp)
      this.bettersSku = resp;
      this.loadingBettersSku = false;
    }, error => {
      console.log('Error in getBetterSku(): ', error);
      this.bettersSku = [];
      this.loadingBettersSku = false;
    })
  }

  getStockVsTotalOfItems(): void {
    console.log('PASANDO  X VSSS');
    
    this.statisticService.getStockVsTotalOfItems().subscribe(dto => {
      this.stockVsTotal = dto;
    }, error => {
      console.log('Error in getStockVsTotalOfItems(): ', error);
      this.stockVsTotal.total = 0;
      this.stockVsTotal.withStock = 0;
    })
  }

  getCountActivePublications(): void {

    this.statisticService.getCountActivePublications(this.currentAccount.userIdBss).subscribe(count => {
      console.log(count)
      this.countActivePublications = count as number;
    }, error => {
      console.log('Error in getCountActivePublications(): ', error);
      this.countActivePublications = 0;
    })
  }

  get percent(): string {
    return `${this.getPercent(this.stockVsTotal.withStock, this.stockVsTotal.total)}%`
  }
  
  getPercent(number1: number, number2: number): number {
    return number1 && number2 ? Math.round((number1 / number2) * 100) : 0;
  }

 currentAccountPromise = (): Promise<MeliAccount[]> => {
    return new Promise( (resolve, reject) => {

      this.accountService.getAccounts().subscribe( (acounts: MeliAccount[]) => {
        if(acounts){
          resolve(acounts)
        } else reject('Meli accounts not found')
      }, error => {
        reject(`Error getting accounts: ${error}`)
      })
    })
  }

  validateBetterSku(){
    return this.betterSku ? this.betterSku : 'NINGUNO'
  }
  private reset(): void {
    this.hiddenSellChart = true;
    this.countAllSalesPaid = 0;
    this.countAllSalesCancelled = 0;
  }
}
