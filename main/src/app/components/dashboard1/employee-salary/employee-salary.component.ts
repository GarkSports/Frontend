import { Component, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService } from 'src/app/services/dashboard.service';

export interface employeeChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, CommonModule], // Include CommonModule here
  templateUrl: './employee-salary.component.html',
})
export class AppEmployeeSalaryComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public employeeChart!: Partial<employeeChart> | any;
  public totalAcademies: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.countAcademies().subscribe(
      (count: number) => {
        // Assign the count to the totalAcademies variable
        this.totalAcademies = count;
      },
      (error) => {
        console.error('Error fetching total academies:', error);
        // Handle error, display error message, etc.
      }
    );
    this.dashboardService.countAcademiesByEtat().subscribe(
      (data: any[]) => {
        const seriesData = data.map(item => item.count);
        const categories = data.map(item => item.etat);
        
        this.employeeChart = {
          series: [
            {
              name: '',
              data: seriesData,
            },
          ],
          chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
            height: 270,
          },
          colors: ['#9ED9B8', '#FFB2B2', '#FFD699', '#B8C9FF'],
          plotOptions: {
            bar: {
              borderRadius: 4,
              columnWidth: '45%',
              distributed: true,
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          grid: {
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          xaxis: {
            categories: categories,
            axisBorder: {
              show: false,
            },
          },
          yaxis: {
            labels: {
              show: false,
            },
          },
          tooltip: {
            theme: 'dark',
          },
        };
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Handle error, display error message, etc.
      }
    );
  }
}
