import { Academie } from "./academie.model";
import { Adherent } from "./adherent.model";
import { Destinataire } from "./enums/destinataire.model";
import { EvenementType } from "./enums/evenementType";
import { Repetition } from "./enums/repetition.model";
import { Equipe } from "./equipe.model";

export class Evenement {
    id: number;
    nom: string;
    description: string;
    type:EvenementType;
    destinataire:Destinataire;
    academie?: Academie;
    equipe?: Equipe;
    membres?:Adherent[];
    dateDebut: Date;
    dateFin: Date;
    heur: Date;
    repetition: boolean;
    chaque: Repetition;
    numero: number;
    adresse: string;
    lieu: string;


}
