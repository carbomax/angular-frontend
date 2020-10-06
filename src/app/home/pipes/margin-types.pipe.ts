import { Pipe, PipeTransform } from '@angular/core';
import { MarginType } from '../../enums/margin.types.enum';

@Pipe({
  name: 'marginTypes'
})
export class MarginTypesPipe implements PipeTransform {

  transform(value: number): string {

    console.log(value)
    if(value === 1){
      return MarginType.SINGLE;
    }
    if(value === 2){
      return MarginType.PERCENT;
    }
  }

}
