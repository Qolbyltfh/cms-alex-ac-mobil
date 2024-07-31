import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  base_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getOrders(paramData: any): Observable<ApiResponse> {
    const options = { params: paramData };

    return this.http.get<ApiResponse>(`${this.base_URL}/orders`, options);
  }

  getOrderDetail(id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.base_URL}/orders/detail/${id}`);
  }

  updateOrder(data: any, id: any) {
    return this.http.put(`${this.base_URL}/orders/${id}/status`, data);
  }

  updateOrderItem(data: any) {
    return this.http.post(`${this.base_URL}/orders/items`, data);
  }
}
