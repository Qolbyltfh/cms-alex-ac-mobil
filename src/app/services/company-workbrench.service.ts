import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class CompanyWorkbrenchService {

  constructor(private http: HttpClient) { }

  getCompanyWorkbrenches(paramData: any): Observable<ApiResponse> {
    const options = { params: paramData };

    return this.http.get<ApiResponse>(`${environment.apiUrl}/carshops`, options);
  }
}
