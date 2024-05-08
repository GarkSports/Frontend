import { Adherent } from "../adherent.model";
import { Equipe } from "../equipe.model";
import { Evenement } from "../evenement.model";


export class ExtendedEventDTO {
    event: Evenement;
    equipe?: Equipe;
    adherent?: Adherent;
}
