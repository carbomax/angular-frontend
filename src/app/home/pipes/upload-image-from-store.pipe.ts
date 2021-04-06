import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'upImageFromStoreBucket'
})
export class UploadImageFromStoreBucketPipe implements PipeTransform {

  transform(images: any[]): string {
    if (images.length > 0) {
      let value = images[0].photos;
      console.log('value: ', value);

      if(value) {
        if(value.trim().startsWith('http://') || value.trim().startsWith('https://')){
          return value;
        } else {
          return environment.URI_STORE_BUCKET + value.trim();
        }
      }
    }

    return 'assets/img/no_image.png';
  }

}
