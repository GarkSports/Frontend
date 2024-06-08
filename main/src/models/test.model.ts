import { Academie } from "./academie.model";
import { Adherent } from "./adherent.model";
import { Categorie } from "./categorie.model";

export class Test {
    id: number;
    testName: string;
    academie: Academie;
    adherent: Adherent;
    categories: Categorie[];
}