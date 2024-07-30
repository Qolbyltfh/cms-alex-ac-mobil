import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  base_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getCustomers(payloadData: any): Observable<ApiResponse> {
    // Initialize HttpParams
    let param = new HttpParams().set('role', 'customer');
  
    // Retrieve token from local storage
    let token = '';
    if (localStorage.getItem('user')) {
      const data = localStorage.getItem('user');
      const parsedData = JSON.parse(data || '{}');
      token = parsedData.data.token;
    } else {
      console.error('User data not found in local storage');
    }
  
    // Set headers with Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Options including params and headers
    const options = {
      params: param,
      headers: headers
    };
  
    // Make the HTTP GET request with headers and params
    return this.http.get<ApiResponse>(`${this.base_URL}/users`, options);
  }

  getAdministrator(payloadData: any): Observable<ApiResponse> {
    let param = new HttpParams()
      .set(`role`, 'superadmin,supervisor')

    const options = { params: param };

    return this.http.get<ApiResponse>(`${this.base_URL}/users`, options);
  }
}
