import { Academie } from "./academie.model";
import { Adherent } from "./adherent.model";
import { EvenementType } from "./enums/evenementType";
import { StatutEvenement } from "./enums/statutEvenenement.model";
import { Equipe } from "./equipe.model";

export class Evenement {
    id?: number;
    type?: EvenementType;
    nomEvent: string;
    lieu: string;
    date: Date;
    heure: string;
    description: string;
    statut?: StatutEvenement;


    convocationEquipe?: Equipe;
    convocationMembres?: Adherent[];

    academie?: Academie;
}
