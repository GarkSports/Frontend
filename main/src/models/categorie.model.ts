import { Kpi } from "./kpi.model";
import { Test } from "./test.model";

export class Categorie {
    id: number;
    categorieName: string;
    test: Test;
    kpis: Kpi[]; 
}