import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'not-image-upload'
})
export class NotImageUploadPipe implements PipeTransform {

  transform(value: string): any {
    if (value === null || value === '') {
      return 'assets/img/no_image.png';
    }
    return value;
  }

}
