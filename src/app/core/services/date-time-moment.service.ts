import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateTimeMomentService {

  constructor() { }


  public getMomentInstance(): moment.Moment{
    return moment();
  }

  public minus(amount: any, unit: any): moment.Moment{
    return this.getMomentInstance().subtract(amount, unit);
  }

  public  helperZeroBeforeMonthOrDay(dayOrMonth: number): string{
    return (dayOrMonth / 10) >= 1 ? `${dayOrMonth}` : `0${dayOrMonth}`;
  }
}
