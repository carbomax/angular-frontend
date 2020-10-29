import { ItemMeliRequest } from './item.meli.request';

export class ItemCustomModel {
    constructor(    
        public item: ItemMeliRequest,
        public idProduct: number
    ){}  
  }