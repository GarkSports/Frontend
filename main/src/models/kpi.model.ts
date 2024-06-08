import { Categorie } from "./categorie.model";
import { ValKpi } from "./valkpi.model";

export class Kpi {
    id: number;
    kpiType: string;
    valkpi: ValKpi[];
    categorie: Categorie;
}