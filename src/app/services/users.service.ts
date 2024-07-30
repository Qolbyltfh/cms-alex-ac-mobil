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
  
    // Construct the URL with multiple parameters
    const url = `${this.base_URL}/users?limit=${payloadData.limit}&offset=${payloadData.offset}&roles=customer`;

    // Make the HTTP GET request with headers
    return this.http.get<ApiResponse>(url, { headers });
  }

  getAdministrator(payloadData: any): Observable<ApiResponse> {
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
  
    // Construct the URL with multiple parameters
    const url = `${this.base_URL}/users?limit=${payloadData.limit}&offset=${payloadData.offset}&roles=superadmin,supervisor`;

    // Make the HTTP GET request with headers
    return this.http.get<ApiResponse>(url, { headers });
  }

  getEmployee(payloadData: any): Observable<ApiResponse> {
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
  
    // Construct the URL with multiple parameters
    const url = `${this.base_URL}/users?limit=${payloadData.limit}&offset=${payloadData.offset}&roles=admin,mechanic`;

    // Make the HTTP GET request with headers
    return this.http.get<ApiResponse>(url, { headers });
  }

  getListCompanyWorkbrench(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.base_URL}/carshops`);
  }

  createUser(data: any) {
    // Retrieve token from local storage
    let token = '';
    if (localStorage.getItem('user')) {
      const data = localStorage.getItem('user');
      const parsedData = JSON.parse(data || '{}');
      token = parsedData.data?.token || '';
    } else {
      console.error('User data not found in local storage');
    }
  
    // Set headers with Authorization token and Content-Type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    // Options including headers
    const options = {
      headers: headers
    };
  
    // Send POST request
    return this.http.post(`${this.base_URL}/users`, data, options);
  }

  updateUser(data: any, id: any) {
    // Retrieve token from local storage
    let token = '';
    if (localStorage.getItem('user')) {
      const data = localStorage.getItem('user');
      const parsedData = JSON.parse(data || '{}');
      token = parsedData.data?.token || '';
    } else {
      console.error('User data not found in local storage');
    }
  
    // Set headers with Authorization token and Content-Type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    // Options including headers
    const options = {
      headers: headers
    };
  
    // Send PUT request
    return this.http.put(`${this.base_URL}/users/${id}`, data, options);
  }
  
}
