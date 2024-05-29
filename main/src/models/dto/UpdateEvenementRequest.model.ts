import { Evenement } from "../evenement.model";


export class UpdateEvenementRequest {
    evenement: Evenement;
    idMembres: number[];

    constructor(evenement: Evenement, idMembres: number[]) {
        this.evenement = evenement;
        this.idMembres = idMembres;
    }


}
