import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Manager } from 'src/models/manager.model';
import { ManagerService } from 'src/app/services/manager.service';
import { DatePipe } from '@angular/common';
import { Academie } from 'src/models/academie.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles } from 'src/models/roles.model';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
})

export class AppProfilComponent implements OnInit {
  managerForm: FormGroup;
  local_data: any;
  action: string;

  dataSource = new MatTableDataSource<string>([]);
  managerSource = new MatTableDataSource<Manager>([]);

  constructor(
    private dialog: MatDialog, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    private managerService: ManagerService,
    private formBuilder: FormBuilder
  ) {
    this.local_data = { ...data };
    //this.action = this.local_data.action;
    console.log("data", this.local_data); // Log local_data instead of data
  
    this.initManagerForm();
  }
  

  ngOnInit(): void {
    this.initManagerForm();
    this.dataSource = new MatTableDataSource<string>([]);
    this.getProfil();
    console.log("this.local_data",this.local_data);
    
  }

  // fetchData() {
  //   // Call your service to fetch the data
  //   this.adminService.getManagers().subscribe(data => {
  //     this.displayedData = data;
  //     this.dataSource = new MatTableDataSource(this.displayedData);
  //     this.dataSource.sort = this.sort;
  //   });
  // }

  getProfil(): void {
    this.managerService.getProfil().subscribe(
      profil => {
        console.log('profil fetched successfully', profil);
        this.managerSource.data = profil;
        this.local_data = profil;
        console.log("this.local_data.data", this.local_data);
        console.log("local_data lastname", this.local_data.lastname);
        this.initManagerForm();
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }
  

    initManagerForm(): void {
      this.managerForm = this.formBuilder.group({
        firstname: [this.local_data.firstname, Validators.required],
        lastname: [this.local_data.lastname, Validators.required],
        email: [this.local_data.email, Validators.required],

        });
  
    }
     

    hide = true;
    hide2 = true;
    conhide = true;
    alignhide = true;
  
    // 3 accordian
    step = 0;
  
    setStep(index: number) {
      this.step = index;
    }
  
    nextStep() {
      this.step++;
    }
  
    prevStep() {
      this.step--;
    }
  
    panelOpenState = false;
}