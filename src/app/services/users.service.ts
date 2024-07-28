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
    let param = new HttpParams()
      .set(`role`, 'customer')

    const options = { params: param };

    return this.http.get<ApiResponse>(`${this.base_URL}/users`, options);
  }
}
