import { Adherent } from "./adherent.model";

export interface AdherentRequest {
    firstname: string;
    lastname: string;
    adresse: string,
    email: string;
    telephone: string;
    photo: string;
    niveauScolaire: string;
    dateNaissance: Date; // Convert the date to a string format
    nationalite: string;
    equipeNames: string[];
  }