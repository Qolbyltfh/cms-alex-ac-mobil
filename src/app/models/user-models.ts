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

interface Role {
    id: string;
    name: string;
    deletedAt: Date | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    id: string;
    image: string;
    phone: string;
    name: string;
    email: string;
    password: string;
    status: string;
    fcm_token: string | null;
    company_branch_id: string | null;
    role_id: string;
    deletedAt: Date | null;
    createdAt: string;
    updatedAt: string;
    roles: Role;
    companyBranch: any; // Replace with actual type if known
    addresses: any[];   // Replace with actual type if known
    cars: any[];        // Replace with actual type if known
  }
  