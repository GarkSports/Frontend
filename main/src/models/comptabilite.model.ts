export class Benefices {
    id?: number;
    type: string;
    etat: string; 
    quantite: number;
    prixunite: number; 
    total: number; 
    date: string;
  }

  export class Depenses extends Benefices {
    beneficiaire: string;
  }
  