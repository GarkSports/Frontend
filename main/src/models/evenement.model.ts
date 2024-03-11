import { Academie } from "./academie.model";

export class Evenement {
    id: number;
    nom: string;
    description: string;
    academie?: Academie;
}
