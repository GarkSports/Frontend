import { Adherent } from "./adherent.model";
import { TypeAbonnement } from "./enums/typeAbonnement.model";

export class Paiement {
    id: number;
    typeAbonnement: TypeAbonnement;
    dateDebut: Date;
    dateFin: Date;
    datePaiement: Date;
    montant: number;
    reste: number;
    remarque: string;
    retardPaiement: number;
    adherent?: Adherent;
}
