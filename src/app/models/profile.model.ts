import { User } from './user.model';
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
  public image?: string;

}
