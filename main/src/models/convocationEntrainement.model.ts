import { Adherent } from "./adherent.model";
import { Equipe } from "./equipe.model";

export class ConvocationEntrainement {
    id?: number;
    date: Date;
    heure: string;

    adherents: Adherent[];
}
