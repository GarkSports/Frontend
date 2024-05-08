import { Academie } from "./academie.model";

export class RoleName {
    id: number;
    academie?: Academie;
    roleName?: string;
    permissions?: string[];
}

export const RoleNameArray = Object.keys(RoleName).map(key => RoleName[key as keyof typeof RoleName]);
