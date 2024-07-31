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

export interface Order {
  id?: string;
  customer_name?: string;
  car_plat_number?: string;
  car_date?: string;
  car_name?: string;
  car_image?: string | null;
  mechanic_name?: string | null;
  customer_address?: string;
  service_type?: string;
  status?: string;
  description?: string;
  distance?: string;
  total_price?: string;
  payment_type?: string | null;
  payment_proof_image?: string | null;
  service_at?: string | null;
  customer_id?: string;
  mechanic_id?: string | null;
  company_branch_id?: string;
  customer_car_id?: string;
  deletedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  company_branch?: CompanyWorkbrench;
}


export interface OrderDetail {
  id?: string;
  customer_name?: string;
  car_plat_number?: string;
  car_date?: string;
  car_name?: string;
  car_image?: string | null;
  mechanic_name?: string | null;
  customer_address?: string;
  service_type?: string;
  status?: string;
  description?: string;
  distance?: string;
  total_price?: string;
  payment_type?: string | null;
  payment_proof_image?: string | null;
  service_at?: string | null;
  customer_id?: string;
  mechanic_id?: string | null;
  company_branch_id?: string;
  customer_car_id?: string;
  deletedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  company_branch?: CompanyWorkbrench;
  order_logs?: OrderLog[];  // Define as an array of OrderLog
  items?: OrderItem[];      // Define as an array of OrderItem
}

export interface OrderLog {
  id?: string;
  status?: string;
  title?: string;
  description?: string;
  order_id?: string;
  deletedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OrderItem {
  id?: string;
  name?: string;
  price?: string;
  quantity?: string;
  order_id?: string;
  deletedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OrderStatus {
  label?: string;
  value?: string;
}