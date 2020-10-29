import { ItemPictures } from './pictures.meli.request';
import { Attributes } from './attributes.meli';
import { Shipping } from './shipping.meli';
import { SaleTerms } from './sale-terms.meli';


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
    public attributes?: Attributes[],
    public videoId?: string,
    public shipping?: Shipping,
    public saleTerms?: SaleTerms[]
  ){

  }

}
