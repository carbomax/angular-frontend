import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../../../services/statistic.service';
import { StockVsTotalItemDto } from '../../../../../models/statistics/stock.vs.total.item.model';
import { BetterSkuDto } from '../../../../../models/statistics/better.sku.model';
import { AnalysisDrop } from '../../../../../models/statistics/analysis.model';
import { DateTimeMomentService } from '../../../../../core/services/date-time-moment.service';
import { CountPaidAndCancellerSalesDto } from '../../../../../models/statistics/count.all.sales.model';



@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  collapse = false;
  countAllSalesPaid = 0;
  countAllSalesCancelled = 0;
  countActivePublications = 0;
  betterSku = '';
  stockVsTotal = new StockVsTotalItemDto();
  bettersSku: BetterSkuDto[] = [];
  loadingBettersSku = false;

  mainColumns: string[] = [];
  subColumns: string[] = [];
  analysisDropTrHelper: AnalysisDropTrHelper[] = [];
  analysisDropTrHelperTotals: AnalysisDropTrHelper[] = [];

  // paginator
  page = 1;
  pageSize = 10;

  years: number[] = [];
  initYear = 0;

  months: MonthsHelper[] = months;
  selectMonths: string [] = []

  loadingSearch = false;
  hiddenSellChart = true;


  constructor(public statisticService: StatisticService, private momentService: DateTimeMomentService) {

  }


  ngOnInit(): void {
    this.initYears()
    this.getCountAllSales();
    this.getCountActivePublications();
    this.getBetterSku();
    this.getStockVsTotalOfItems();

  }

  initYears() {
    const currentDate = this.momentService.getMomentInstance().format('yyyy-MM');
    this.initYear = +currentDate.split('-')[0];
    this.makeYears(this.initYear)
    this.selectMonths = [];
    this.selectMonths.push(currentDate.split('-')[1]);
    this.getAnalysisDrop([currentDate]);
  }

  selectChangeHandlerYear(year) {
    this.initYear = +year;
    this.makeYears(this.initYear)
  }

  makeYears(year: number) {
    let temporalYears = [...this.years];
    temporalYears = [];
    for (var i = year - 10; i <= year + 10; i++) {
      temporalYears.push(i);
    }
    this.years = [...temporalYears];
  }

  getCountAllSales(): void {

    this.statisticService.getCountAllSales().subscribe((count: CountPaidAndCancellerSalesDto) => {
      console.log(count)
      this.countAllSalesPaid = count.paid;
      this.countAllSalesCancelled = count.cancelled;
    }, error => {
      console.log('Error in getCountAllSales(): ', error);
      this.countAllSalesPaid = 0;
      this.countAllSalesCancelled = 0;
    })
  }

  getCountActivePublications(): void {

    this.statisticService.getCountActivePublications().subscribe(count => {
      console.log(count)
      this.countActivePublications = count as number;
    }, error => {
      console.log('Error in getCountActivePublications(): ', error);
      this.countActivePublications = 0;
    })
  }

  getBetterSku(): void {

    this.statisticService.getBetterSku().subscribe((resp: any) => {
      console.log('Better sku', resp)
      if (resp.sku !== undefined && resp.sku !== null) {
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
    this.getBettersSku();
  }

  getBettersSku(): void {
    this.loadingBettersSku = true;
    this.statisticService.getBettersSku(100).subscribe((resp: BetterSkuDto[]) => {
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
    this.statisticService.getStockVsTotalOfItems().subscribe(dto => {
      this.stockVsTotal = dto;
    }, error => {
      console.log('Error in getStockVsTotalOfItems(): ', error);
      this.stockVsTotal.total = 0;
      this.stockVsTotal.withStock = 0;
    })
  }


  get percent(): string {
    return `${this.getPercent(this.stockVsTotal.withStock, this.stockVsTotal.total)}%`
  }
  getPercent(number1: number, number2: number): number {
    return number1 && number2 ? Math.round((number1 / number2) * 100) : 0;
  }

  searchAnalysisDrop(){
      if(this.selectMonths){
        this.loadingSearch = true;
        let dates: string[] = [];
       this.selectMonths.forEach( m => dates.push(`${this.initYear}-${m}`));
       this.getAnalysisDrop(dates);
      } else {
        return;
      }
  }

  getAnalysisDrop(dates: string[]) {
    console.log('DATES', dates)
    this.statisticService.getAnalysisDrop(dates).subscribe((analysis: AnalysisDrop[]) => {
      this.subColumns = [];
      this.mainColumns = [];
      this.analysisDropTrHelper = [];
      this.analysisDropTrHelperTotals = [];
      let names: string[] = [];

      console.log('BEDFORE', analysis)
      analysis = this.sortAnaysisDropByDate(analysis);

      console.log('AFTER', analysis)
      analysis[0].sellerAnalysisDrop.forEach(item => {
        names.push(item.sellerName);
      })

      console.log(names)
      // Making colums
      analysis.forEach(item => {
        this.subColumns.push('Ventas');
        this.subColumns.push('$');
        this.mainColumns.push(item.date);
      });

      this.subColumns.push('Total');
      this.subColumns.push('Total - $');
      this.mainColumns.push('TOTALES');

      names.forEach(name => {
        const helper = new AnalysisDropTrHelper();
        analysis.forEach(analys => {
          analys.sellerAnalysisDrop.forEach(s => {
            if (s.sellerName.trim() === name.trim()) {
              helper.values.push(s.salesCount);
              helper.values.push(s.amount);
              return;
            }
          })
        })
        helper.name = name;
        this.analysisDropTrHelper.push(helper);


      });


      this.analysisDropTrHelper.forEach( analysis => {

        let totalSell = 0;
        let totalAmount = 0;
        for( var i = 0; i < analysis.values.length; i++){
          i % 2 ? totalAmount += +analysis.values[i] : totalSell += +analysis.values[i]
        }
        analysis.totalSell = totalSell;
        analysis.totalAmount = totalAmount;

      })

      const helperTotal = new AnalysisDropTrHelper();
      analysis.forEach( analysis => {
        helperTotal.values.push(analysis.totalSalesCount);
        helperTotal.values.push(analysis.totalAmount);
      } )

      let totalSellHelper = 0;
      let totalAmountHelper = 0;
      this.analysisDropTrHelper.forEach( analysis => {

        totalSellHelper += analysis.totalSell;
        totalAmountHelper +=analysis.totalAmount

      })
      helperTotal.values.push(totalSellHelper);
      helperTotal.values.push(totalAmountHelper);
      helperTotal.name = 'TOTALES-MES';
      this.analysisDropTrHelperTotals.push(helperTotal);
      this.loadingSearch = false;

    }, error => {
      console.log('Error getAnalysisDrop:', error)
      this.loadingSearch = false;
    })
  }

  public disbleSearchAnalysisDrop(): boolean{
    return this.selectMonths.length > 0 ? false : true;
  }

  private sortAnaysisDropByDate(analysis): AnalysisDrop[]{
    analysis.sort( (n1, n2) => {
      if (n1.date > n2.date) {
        return 1;
    }

    if (n1.date < n2.date) {
        return -1;
    }

    return 0;
    })

    return analysis;
  }

  validateBetterSku(){
    return this.betterSku ? this.betterSku : 'NINGUNO'
  }


}

export class AnalysisDropTrHelper {
  public name: string;
  public values: number[] = [];
  public totalSell?: number;
  public totalAmount?: number;
}

export class MonthsHelper {
  public name: string;
  public id:string;
}

export const months: MonthsHelper[] = [
  {
    name: 'Enero',
    id: '01'
  },
  {
    name: 'Febrero',
    id: '02'
  },
  {
    name: 'Marzo',
    id: '03'
  },
  {
    name: 'Abril',
    id: '04'
  },
  {
    name: 'Mayo',
    id: '05'
  },
  {
    name: 'Junio',
    id: '06'
  },
  {
    name: 'Julio',
    id: '07'
  },
  {
    name: 'Agosto',
    id: '08'
  },
  {
    name: 'Septiembre',
    id: '09'
  },
  {
    name: 'Octubre',
    id: '10'
  },
  {
    name: 'Noviembre',
    id: '11'
  },
  {
    name: 'Diciembre',
    id: '12'
  }
]
