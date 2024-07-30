import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  base_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getRole(): Observable<ApiResponse> {  
    return this.http.get<ApiResponse>(`${this.base_URL}/master/roles`);
  }

  getServiceType(): Observable<ApiResponse> {  
    return this.http.get<ApiResponse>(`${this.base_URL}/master/service-type`);
  }

  getOrderStatus(): Observable<ApiResponse> {  
    return this.http.get<ApiResponse>(`${this.base_URL}/master/order-status`);
  }
}
