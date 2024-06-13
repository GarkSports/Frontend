import {Adherent} from "./adherent.model";
import {TypeAbonnement} from "./enums/typeAbonnement.model";

export class Paiement {
    id: number;
    typeAbonnement: TypeAbonnement;
  dateDebut: Date = new Date;
  dateFin: any;
  datePaiement: any;
    montant: number;
    reste: number;
    remarque: string;
    retardPaiement: number;
    adherent?: Adherent;
}
