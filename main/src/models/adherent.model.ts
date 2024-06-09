import { Academie } from "./academie.model";
import { Discipline } from "./discipline.model";
import { StatutAdherent } from "./enums/statutAdherent.model";
import { InformationsParent } from "./informationsParent";
import { Paiement } from "./paiement.model";
import { User } from "./user.model";

export class Adherent extends User {
    informationsParent: InformationsParent;
    discipline?: Discipline;
    academie?: Academie;
    paiement?: Paiement;
    nomEquipe: string;
    equipeId: number;
    statutAdherent: StatutAdherent;
    creationDate: Date;
    paiementDate: Date;
}
