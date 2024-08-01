import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  base_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardResponse> {
    // Get the current date
    const currentDate = new Date();

    // Calculate the first day of the current month
    const startYear = currentDate.getFullYear();
    const startMonth = currentDate.getMonth(); // January is 0
    const startDate = new Date(startYear, startMonth, 1);

    // Calculate the last day of the current month
    const endDate = new Date(startYear, startMonth + 1, 0); // Set day to 0 of the next month to get the last day of the current month

    // Format dates as 'YYYY-MM-DD'
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    // Append formatted dates as query parameters
    return this.http.get<DashboardResponse>(
      `${this.base_URL}/dashboard?platform=web&start_date=${startDateString}&end_date=${endDateString}`
    );
  }
}
