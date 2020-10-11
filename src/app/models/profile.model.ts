import { User } from './user.model';
import { Marketplace } from './marketplace.model';
export class Profile {

  public id: number;
  public firstName: string;
  public lastName: string;
  public businessName: string;
  public store: string;
  public enabled = false;
  public rut: string;
  public address: string;
  public user: User;
  public marketplaces?: Marketplace[];
  public image?: string;

}
