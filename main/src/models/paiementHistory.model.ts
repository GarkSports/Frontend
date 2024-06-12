import { Adherent } from "./adherent.model";
import { StatutAdherent } from "./enums/statutAdherent.model";

export class PaiementHistory {
    id: number;
    dateDebut: Date;
    dateFin: Date;
    datePaiement: Date;
    montant: number;
    reste: number;
    retardPaiement: number;
    statutAdherent: StatutAdherent;
    adherent?: Adherent;
}
