import { Image } from '../image.model';

export  class ProductMeliPublished {

  public id: number;

  public mlPublicationId: number;

  public accountMeli: number;

  public idPublicationMeli: string;

  public title: string;

  public permalink: string;

  public categoryMeli: string;

  public pricePublication: string;

  public priceCostUYU: number;

  public priceCostUSD: number;

  public priceEditProduct: number;

  public warrantyType: string;

  public warrantyTime: string;

  public margin: number;

  public lastUpgrade: string;

  public status: string;

  public saleStatus: number;

  public sku: string;

  public accountName: string;

  public images: Image[];

  public description: string;

  public currentStock: number;

  public deleted: number;

  public specialPaused: number;

  public flex: number;

  public selected? = false;

}


export class PageProductMeliPublished {
  public content: ProductMeliPublished[];
  public numberOfElements: number;
  public totalElements: number;
}
