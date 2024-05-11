import { Evenement } from "../evenement.model";


export class MatchAmicalRequest {
  evenement: Evenement;
  equipeId: number;
  horaire: string;

  constructor(evenement: Evenement, equipeId: number, horaire: string) {
    this.evenement = evenement;
    this.equipeId = equipeId;
    this.horaire = horaire;
  }
}
