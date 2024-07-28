import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class CompanyWorkbrenchService {

  base_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getCompanyWorkbrenches(paramData: any): Observable<ApiResponse> {
    const options = { params: paramData };

    return this.http.get<ApiResponse>(`${this.base_URL}/carshops`, options);
  }

  createCompanyWOrkbrench(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${this.base_URL}/carshops`, data, httpOptions);
  }

  updateCompanyWOrkbrench(data: any, id: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(`${this.base_URL}/carshops/${id}`, data, httpOptions);
  }

  uploadImage(data: any) {
    return this.http.post(`${this.base_URL}/utils/upload/image`, data);
  }

  deleteCompanyWOrkbrench(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.delete(`${this.base_URL}/carshops/${id}`, httpOptions);
  }
}
