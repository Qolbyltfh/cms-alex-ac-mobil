export interface Users {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    role_id?: string;
    company_branch_id?: string;
    image?: string;
    status?: string;
    addresses?: any[];
    cars?: any[];
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}
