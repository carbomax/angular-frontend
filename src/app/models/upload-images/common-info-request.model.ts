import { Image } from '../image.model';
export class CommonInfoRequest{
  constructor(
    public sku: string,
    public images: Image[]
   ){}
  }
