import { Academie } from "./academie.model";
import { Discipline } from "./discipline.model";
import { StatutAdherent } from "./enums/statutAdherent.model";
import { Equipe } from "./equipe.model";
import { InformationsParent } from "./informationsParent";
import { Paiement } from "./paiement.model";
import { User } from "./user.model";

export class Adherent extends User {
    informationsParent?: InformationsParent;
    discipline?: Discipline;
    academie?: Academie;
    paiement?: Paiement;
    nomEquipe: string;
    equipes: Equipe[];
    equipeId: number;
    statutAdherent: StatutAdherent;
    creationDate: Date;
    paiementDate: Date;
    niveauScolaire: string;
}
