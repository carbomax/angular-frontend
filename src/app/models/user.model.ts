import { Role } from './role.model';


export class User {

    public id: number;
    public email: string;
    public password: string;
    public roles: Role[];
    public createAt?: Date;
    public enabled?: boolean;
}
