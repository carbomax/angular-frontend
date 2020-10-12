import { User } from './user.model';
import { Marketplace } from './marketplace.model';
export class Profile {

  public id: number;
  public firstName: string;
  public lastName: string;
  public enabled = false;
  public address: string;
  public user: User;
  public rut?: string;
  public store?: string;
  public businessName?: string;
  public marketplaces?: Marketplace[];
  public image?: string;

}
