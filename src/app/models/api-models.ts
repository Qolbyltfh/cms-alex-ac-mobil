export interface CompanyWorkbrench {
    id: string;
    name: string;
    description: string;
    address: string;
    lat: string;
    long: string;
    open_time: string;
    close_time: string;
    day: string[];
    image: string;
    phone: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiResponse {
    status: boolean;
    data: CompanyWorkbrench[];
    meta: {
      currentPage: number;
      total: number;
      limit: number;
      offset: number;
    };
  }
  