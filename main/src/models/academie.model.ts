import { Adherent } from "./adherent.model";
import { AcademieType } from "./enums/academie-type.model";
import { Etat } from "./enums/etat.model";
import { Evenement } from "./evenement.model";

export class Academie {
    id: number;
    nom: string;
    type: AcademieType;
    fraisAdhesion: number;
    logo: string;
    affiliation: string;
    etat: Etat;
    description: string;
    isArchived: boolean;
    disciplineIds?: number[];
    adherents?: Adherent[];
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
    manager_id?: number;
    evenements?: Evenement[];
}
