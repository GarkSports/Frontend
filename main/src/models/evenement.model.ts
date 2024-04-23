import { Academie } from "./academie.model";
import { Adherent } from "./adherent.model";
import { EvenementType } from "./enums/evenementType";
import { Equipe } from "./equipe.model";

export class Evenement {
    id?: number;
    type: EvenementType;
    nomEvent: string;
    lieu: string;
    date: Date;
    heure: Date;
    description: string;
    convocationEquipe?: Equipe;
    convocationMembres?: Adherent[];
    test?: string;
    nomAdversaire?: string;
    convocationEquipes?: Equipe[];
    academie?: Academie;
}
