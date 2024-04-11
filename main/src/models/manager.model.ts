import { Academie } from "./academie.model";
import { User } from "./user.model";

export class Manager extends User {
    telephone2: string;
    academie?: Academie;
}
