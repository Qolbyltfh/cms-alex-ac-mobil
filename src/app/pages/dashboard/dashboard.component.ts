import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Dashboard, DashboardResponse } from 'src/app/models/api-models';
import { NgxSpinnerService } from 'ngx-spinner';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart!: Chart;

  totalOrderThisMonth: number = 0;
  totalIncomeThisMonth: number | null = null;
  totalIncome: number | null = null;
  list_data!: Dashboard; // Ensure this matches your response data type

  constructor(private dashboardService: DashboardService, private spinner: NgxSpinnerService) {}

  ngAfterViewInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.spinner.show();
    this.dashboardService.getDashboard().subscribe((response) => {
      if (response.status) {
        this.list_data = response.data; // This should correctly assign the type

        this.totalOrderThisMonth = response.data.total_order_this_month;
        this.totalIncomeThisMonth = response.data.total_income_this_month;
        this.totalIncome = response.data.total_income;
        this.updateChart(response.data.total_price_by_month);
        this.spinner.hide();
      }
    });
  }

  updateChart(data: number[]) {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Adjust according to your data
        datasets: [{
          label: 'Total Penghasilan',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
