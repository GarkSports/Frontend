import { Adherent } from "./adherent.model";
import { Discipline } from "./discipline.model";
import { Equipe } from "./equipe.model";
import { User } from "./user.model";

export class Entraineur extends User {
    discipline?: Discipline;
    adherents?: Adherent[];
    equipes?: Equipe[];

}
