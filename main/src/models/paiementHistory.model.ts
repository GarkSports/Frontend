import { Adherent } from "./adherent.model";

export class PaiementHistory {
    id: number;
    dateDebut: Date;
    dateFin: Date;
    datePaiement: Date;
    montant: number;
    reste: number;
    retardPaiement: number;
    adherent?: Adherent;
}
