import { Adherent } from "./adherent.model";
import { AcademieType } from "./enums/academie-type.model";
import { Etat } from "./enums/etat.model";
import { Evenement } from "./evenement.model";
import { Manager } from "./manager.model";

export class Academie {
    id: number;
    nom: string;
    type: AcademieType;
    fraisAdhesion: number;
    logo: string;
    backgroundImage: string;
    etat: Etat;
    description: string;
    isArchived: boolean;
    adherents?: Adherent[];
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
    manager_id?: number;
    manager: Manager;
}
