import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notImageProfile'
})
export class NotImageProfilePipe implements PipeTransform {

  transform(image: string): unknown {
    if (image == null) {
      return 'assets/img/no_image_profile.png';
    }
    return image;
  }

}
