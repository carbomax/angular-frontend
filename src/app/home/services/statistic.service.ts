import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Serie } from '../../models/serie.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StockVsTotalItemDto } from '../../models/statistics/stock.vs.total.item.model';
import { BetterSkuDto } from '../../models/statistics/better.sku.model';
import { AnalysisDrop } from '../../models/statistics/analysis.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  URI_MELI = `${environment.URI_ROOT}/meli/api`;
  URI_MELI_STATISTICS = `${this.URI_MELI}/statistics`;



  constructor(private http: HttpClient) {
    this.getAnalysisDrop(['2020-12','2020-11']);
  }


  public getSalesByBusinessDateCreated(dateFrom: number, dateTo: number): Observable<Serie[]>{

    let url = `${this.URI_MELI_STATISTICS}/all-sales-by-date-and-count?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    let series : Serie[] = [];

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

  public getCountAllSales(): Observable<Number>{
    return this.http.get<Number>(`${this.URI_MELI_STATISTICS}/count-all-sales`);
  }

  public getCountActivePublications(): Observable<Number>{
    return this.http.get<Number>(`${this.URI_MELI_STATISTICS}/count-active-publications`);
  }

  public getBetterSku(): Observable<any>{
    return this.http.get<any>(`${this.URI_MELI_STATISTICS}/better-sku`);
  }

  public getBettersSku(size: number): Observable<BetterSkuDto[]>{
    return this.http.get<BetterSkuDto[]>(`${this.URI_MELI_STATISTICS}/better-sku/${size}`)
                    .pipe(map( (resp:BetterSkuDto[])  => {
                      let count = 0;
                      resp.forEach( element => element.ranking = count = count + 1)
                      return resp;
                    }))
  }

  public getStockVsTotalOfItems(): Observable<StockVsTotalItemDto>{
     return this.http.get<StockVsTotalItemDto>(`${this.URI_MELI_STATISTICS}/stock-vs-total-items`);
  }

  public getAnalysisDrop(dates: string[]): Observable<AnalysisDrop[]>{
    return this.http.get<AnalysisDrop[]>(`${this.URI_MELI_STATISTICS}/analysis-drop?dates=${dates}`);
 }

}
