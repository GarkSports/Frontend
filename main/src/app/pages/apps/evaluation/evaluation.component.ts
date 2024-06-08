import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EquipeService } from 'src/app/services/equipe.service';
import { StaffService } from 'src/app/services/staff.service';
import { Equipe } from 'src/models/equipe.model';
import { Test } from 'src/models/test.model';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaltest.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class AppEvaluationComponent implements OnInit {
  dataSource = new MatTableDataSource<Test>([]);
  testCards: Test[] = [];

  evaluationForm: FormGroup;
  isEvaluationFormVisible = false;
  evaluation: any = {}; // Define an object to store form data
  local_data: any;

  constructor(
    //public data: Equipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Equipe,

    private staffService: StaffService,
  ) {
    this.local_data = { ...data };
  }

  

  ngOnInit(): void {
    this.getTest();
    this.dataSource = new MatTableDataSource<Test>([]);
  }




  getTest(): void {
    this.staffService.getTests().subscribe(tests => {
      this.testCards = tests;
      this.dataSource.data = tests;
      this.local_data = tests;
      console.log("equipes: ",this.local_data);

    });
  }

  openTest(action: string, obj: any): void{
    console.log("hello");
    const queryParams = new URLSearchParams({
      action,
      id: obj.id
    }).toString();
    const url = `/apps/test?${queryParams}`;
    window.location.href = url;
  }
}