import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'uploadEditImage'
})
export class UploadEditImagePipe implements PipeTransform {

  transform(value: string): string {
      console.log('value: ', value);
      if(value) {
        if(value.trim().startsWith('http://') || value.trim().startsWith('https://')){
          return value;
        } else {
          return environment.URI_UPLOAD_BUCKET + value.trim();
        }
      }

    return 'assets/img/no_image.png';
  }

}
