import { Academie } from "./academie.model";
import { Discipline } from "./discipline.model";
import { User } from "./user.model";

export class Adherent extends User{
    informationParent: string;
    discipline?: Discipline;
    academie?: Academie;
}
