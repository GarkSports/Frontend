import { Evenement } from "../evenement.model";


export class TestRequest {
    evenement: Evenement;
    idEquipe: number[];
    idMembres: number[];

    constructor(evenement: Evenement, idEquipe: number[], idMembres: number[]) {
        this.evenement = evenement;
        this.idEquipe = idEquipe;
        this.idMembres = idMembres;
    }


}
