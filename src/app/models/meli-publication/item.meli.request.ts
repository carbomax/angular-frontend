import { ItemPictures } from './pictures.meli.request';
export class ItemMeliRequest {
  constructor(
    public title: string,
    public categoryId: string,
    public price: number,
    public currencyId: string,
    public availableQuantity: string,
    public buyingMode: string,
    public condition: string,
    public listingTypeId: string,
    public description: string,
    public pictures: ItemPictures[],
    public attributes?: any,
    public videoId?: string
  ){

  }

}
