import { User } from './user.model';
export class Profile {

  id: number;
  firstName: string;
  lastName: string;
  user: User;
  image?: string;

}
