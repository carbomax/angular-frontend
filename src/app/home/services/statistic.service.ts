import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Serie } from '../../models/serie.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StockVsTotalItemDto } from '../../models/statistics/stock.vs.total.item.model';
import { BetterSkuDto } from '../../models/statistics/better.sku.model';
import { AnalysisDrop } from '../../models/statistics/analysis.model';
import { CountPaidAndCancellerSalesDto } from '../../models/statistics/count.all.sales.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  URI_MELI = `${environment.URI_ROOT}/meli/api`;
  URI_MELI_STATISTICS = `${this.URI_MELI}/statistics`;



  constructor(private http: HttpClient) {}


  public getSalesByBusinessDateCreated(dateFrom: number, dateTo: number, sellerId?: number): Observable<Serie[]>{

    let url = `${this.URI_MELI_STATISTICS}/all-sales-by-date-and-count${this.getSellerParameter(sellerId)}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    let series : Serie[] = [];

    console.log(url)
    return this.http.get<Serie[]>(url).pipe(map(( result: any[]) => {

      result.forEach( (element: any) => {
        const serie =  new Serie();
        serie.name = element.dateCreated
        serie.value = element.count
        series.push(serie);
      })

      return series;
    }))
  }

  public getCountAllSales(sellerId?: number): Observable<CountPaidAndCancellerSalesDto>{

    return this.http.get<CountPaidAndCancellerSalesDto>(`${this.URI_MELI_STATISTICS}/count-all-sales${this.getSellerParameter(sellerId)}`);
  }

  public getCountActivePublications(sellerId?: number): Observable<Number>{
    return this.http.get<Number>(`${this.URI_MELI_STATISTICS}/count-active-publications${this.getSellerParameter(sellerId)}`);
  }

  public getBetterSku(sellerId?: number): Observable<any>{
    return this.http.get<any>(`${this.URI_MELI_STATISTICS}/better-sku${this.getSellerParameter(sellerId)}`);
  }

  public getBettersSku(size: number, sellerId?: number): Observable<BetterSkuDto[]>{
    return this.http.get<BetterSkuDto[]>(`${this.URI_MELI_STATISTICS}/better-sku/${size}
    ${this.getSellerParameter(sellerId)}`)
                    .pipe(map( (resp:BetterSkuDto[])  => {
                      let count = 0;
                      resp.forEach( element => element.ranking = count = count + 1)
                      return resp;
                    }))
  }

  public getStockVsTotalOfItems(): Observable<StockVsTotalItemDto>{
     return this.http.get<StockVsTotalItemDto>(`${this.URI_MELI_STATISTICS}/stock-vs-total-items`);
  }

  public getAnalysisDrop(dates: string[], sellerId?: number): Observable<AnalysisDrop[]>{
    return this.http.get<AnalysisDrop[]>(`${this.URI_MELI_STATISTICS}/analysis-drop${this.getSellerParameter(sellerId)}&dates=${dates}`);
 }

 private getSellerParameter(sellerId){

  console.log('User id', sellerId)
    return sellerId ? `?sellerId=${sellerId}` : '?sellerId=';

}

}
