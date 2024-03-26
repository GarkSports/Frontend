import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Academie } from 'src/models/academie.model';


@Component({
  selector: 'app-top-projects',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './top-projects.component.html',
})
export class AppTopProjectsComponent implements OnInit {

  displayedColumns: string[] = ['Academie', 'Affiliation', 'Description', 'Frais Adhesion'];
  dataSource: Academie[] = [];

  // Inject the DashboardService in the constructor
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchAcademies();
  }
  
  fetchAcademies(): void {
    this.dashboardService.getAcademiesWithMostEvents().subscribe(
      (data: Academie[]) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error fetching top projects:', error);
        // Handle error, display error message, etc.
      }
    );
  }
  
}
