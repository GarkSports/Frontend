import { Evenement } from "../evenement.model";
import { EquipeHoraireDTO } from "./EquipeHoraireDTO.model";


export class MatchAmicalRequest {
  evenement: Evenement;
  equipesHoraire: EquipeHoraireDTO[];

  constructor(evenement: Evenement, equipesHoraire: EquipeHoraireDTO[]) {
    this.evenement = evenement;
    this.equipesHoraire = equipesHoraire;
  }
}
