import { Image } from '../image.model';
import { ItemMeliRequest } from './item.meli.request';

export class ItemCustomModel {
    constructor(    
        public item: ItemMeliRequest,
        public idPublicationProduct: number,
        public sku: String,
        public images: Image[],
        public priceCostUYU: number,
        public priceCostUSD: number,
        public priceEditProduct: number
    ){}  
  }