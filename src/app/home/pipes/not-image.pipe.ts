import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notImage'
})
export class NotImagePipe implements PipeTransform {

  transform(images: any[]): string {
    if (images.length > 0) {
      return images[0].photos;
    }
    return 'assets/img/no_image.png';
  }

}
