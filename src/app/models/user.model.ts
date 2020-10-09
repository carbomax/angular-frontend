import { Role } from './role.model';
import { Marketplace } from './marketplace.model';


export class User {

    public id: number;
    public email: string;
    public password: string;
    public roles: Role[];
    public marketplaces: Marketplace[];
    public createAt?: Date;
    public enabled?: boolean;
}
