import { Academie } from "./academie.model";
import { Discipline } from "./discipline.model";
import { StatutAdherent } from "./enums/statutAdherent.model";
import { Paiement } from "./paiement.model";
import { User } from "./user.model";

export class Adherent extends User {
    informationParent: string;
    discipline?: Discipline;
    academie?: Academie;
    paiement?: Paiement;
    nomEquipe: string;
    statutAdherent: StatutAdherent;
    creationDate: Date;
    paiementDate: Date;

}
