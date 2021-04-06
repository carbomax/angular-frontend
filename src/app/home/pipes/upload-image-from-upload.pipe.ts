import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'upImageFromUploadBucket'
})
export class UploadImageFromUploadBucketPipe implements PipeTransform {

  transform(images: any[]): string {
    if (images.length > 0) {
      let value = images[0].photos;
      console.log('value: ', value);

      if(value) {
        if(value.trim().startsWith('http://') || value.trim().startsWith('https://')){
          return value;
        } else {
          return environment.URI_UPLOAD_BUCKET + value.trim();
        }
      }
    }

    return 'assets/img/no_image.png';
  }

}
