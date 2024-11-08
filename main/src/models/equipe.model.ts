import { Academie } from "./academie.model";
import { Adherent } from "./adherent.model";
import { ConvocationEntrainement } from "./convocationEntrainement.model";
import { Discipline } from "./discipline.model";
import { Entraineur } from "./entraineur.model";
import { GenreEquipe } from "./enums/genreEquie.model";
import { Evenement } from "./evenement.model";

export class Equipe {
    id: number;
    nom: string;
    genre: GenreEquipe;
    groupeAge: string;
    couleur: string;
    codeEquipe: string;
    logo: string;
    discipline?: Discipline;
    adherents?: Adherent[];
    entraineurs?: Entraineur[];
    academie?: Academie;
    dateMatchAmical: string;

    convocations?: ConvocationEntrainement[];

}
