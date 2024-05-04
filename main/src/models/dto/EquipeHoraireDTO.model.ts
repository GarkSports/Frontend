export class EquipeHoraireDTO {
    equipeId: number;
    horaire: string;
  
    constructor(equipeId: number, horaire: string) {
      this.equipeId = equipeId;
      this.horaire = horaire;
    }
  }
  