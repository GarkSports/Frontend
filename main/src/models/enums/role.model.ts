export enum Role {
    ADHERENT = 'Adherent',
    ADMIN = 'Admin',
    ENTRAINEUR = 'Entraineur',
    MANAGER = 'Manager',
    PARENT = 'Parent',
    STAFF = 'Staff'
}

export const RoleArray = Object.keys(Role).map(key => Role[key as keyof typeof Role]);
