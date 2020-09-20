import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notImage'
})
export class NotImagePipe implements PipeTransform {

  transform(images: any[]): string {
    console.log(images)
    if(images.length > 0){
      return images[0].photo;
    }
    return 'assets/img/no_image.png';
  }

}
