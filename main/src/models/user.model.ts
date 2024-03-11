import { Role } from "./enums/role.model";

export class User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: Role;
    dateNaissance: Date;
    adresse: string;
    telephone: string;
    nationalite: string;
    photo: string;
}
