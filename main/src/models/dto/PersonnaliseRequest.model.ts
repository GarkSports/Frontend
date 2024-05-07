import { Evenement } from "../evenement.model";


export class PersonnaliseRequest {
    evenement: Evenement;
    idEquipe: number | null;
    idMembres: number[];

    constructor(evenement: Evenement, idEquipe: number | null, idMembres: number[]) {
        this.evenement = evenement;
        this.idEquipe = idEquipe;
        this.idMembres = idMembres;
    }


}
