import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService } from 'src/app/services/dashboard.service';

export interface salesoverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  stroke: ApexStroke;
}
@Component({
  selector: 'app-sales-overview',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule],
  templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public salesoverviewChart!: Partial<salesoverviewChart> | any;

  constructor(private dashboardService: DashboardService) {
    this.salesoverviewChart = {
      series: [55, 55, 55],

      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",

        toolbar: {
          show: false,
        },
        height: 275,
      },
      labels: ['Profit', 'Revenue', 'Expance'],
      colors: ['#5D87FF', '#ECF2FF', '#49BEFF'],
      plotOptions: {
        pie: {
          donut: {
            size: '89%',
            background: 'transparent',

            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 7,
              },
              value: {
                show: false,
              },
              total: {
                show: true,
                color: '#2A3547',
                fontSize: '13px',
                fontWeight: '600',
                label: 'Total : 0',
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
      },
    };
  }

  ngOnInit() {
    // Call the method to fetch data when the component initializes
    this.updateEvenementsCount();
    this.getDataAndUpdateChart();

  }

  getDataAndUpdateChart() {
    // Call your service method here
    this.dashboardService.countEventsWithType().subscribe((data: any) => {
      // Extract series data from the received data
      const seriesData = data.map((item: any) => item.count);
      // Extract labels from the received data
      const labels = data.map((item: any) => item.type);
  
      // Define colors for each type
      const colors = ['#5D87FF', '#AAAAAA', '#49BEFF', '#FF0000', '#00FF00', '#FFA500'];
  
      // Update chart series, labels, and colors with the received data
      this.salesoverviewChart = {
        ...this.salesoverviewChart,
        series: seriesData,
        labels: labels,
        colors: colors,
      };
    });
  }

  updateEvenementsCount(): void {
    this.dashboardService.countEvenements().subscribe(
      (count) => {
        // Update the total label dynamically
        this.salesoverviewChart.plotOptions.pie.donut.labels.total.label = `Total : ${count} events`;
      },
      (error) => {
        console.error('Error fetching evenements count:', error);
        // Handle error, display error message, etc.
      }
    );
  }
  
  
  
  
  

  

  
  
  
}
