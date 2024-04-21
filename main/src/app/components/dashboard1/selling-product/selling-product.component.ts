import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-selling-product',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './selling-product.component.html',
})
export class AppSellingProductComponent implements OnInit {
  academieCount: number = 0;
  clubCount: number = 0;
  academiePercentage: number = 0;
  clubPercentage: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.countClubAcademie().subscribe(
      (data: any) => {
        this.academieCount = data.academieCount;
        this.clubCount = data.clubCount;
        this.academiePercentage = data.academiePercentage;
        this.clubPercentage = data.clubPercentage;
      },
      (error) => {
        console.error('Error fetching club academie count:', error);
        // Handle error, display error message, etc.
      }
    );
  }
}
