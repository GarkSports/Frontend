import { Evenement } from "../evenement.model";
import { EquipeHorraireDTO } from "./equipeHorraireDTO .model";


export class MatchAmicalRequest {
  evenement: Evenement;
  equipesHorraires: EquipeHorraireDTO[];

  constructor(evenement: Evenement, equipesHorraires: EquipeHorraireDTO[]) {
    this.evenement = evenement;
    this.equipesHorraires = equipesHorraires;
  }
}
