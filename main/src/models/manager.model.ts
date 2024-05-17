import { Academie } from "./academie.model";
import { StatutManager } from "./enums/statutManager";
import { User } from "./user.model";

export class Manager extends User {
    telephone2: string;
    academie?: Academie;
    roleName?: string;
    permissions?: string[];
    nomEquipe: string;
}
