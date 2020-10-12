import { Marketplace } from './marketplace.model';
export class Margin {

  public name: string;
  public type: number;
  public value: number;
  public marketplaceId: number;
  public marketplace?: Marketplace;
  public id?: number;

}
