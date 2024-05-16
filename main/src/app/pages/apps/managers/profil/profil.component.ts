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
import { CommonModule, DatePipe } from '@angular/common';
import { Academie } from 'src/models/academie.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles } from 'src/models/roles.model';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-profil',
  
  //imports: [MaterialModule, TablerIconsModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
})

export class AppProfilComponent implements OnInit {
  managerForm: FormGroup;
  local_data: any;
  action: string;
  equipes: string[];
  dataSource = new MatTableDataSource<string>([]);
  managerSource = new MatTableDataSource<Manager>([]);
  //dataSource = new MatTableDataSource<Manager>([]);
  userRole: string = '';

  constructor(
    private dialog: MatDialog, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    private managerService: ManagerService,
    private formBuilder: FormBuilder
  ) {
    this.local_data = { ...data };
    this.userRole = this.local_data.role;
    console.log("data", this.local_data);
    console.log("userRole", this.userRole);
    
    this.initManagerForm();
  }
  

  ngOnInit(): void {
    this.initManagerForm();
    this.dataSource = new MatTableDataSource<string>([]);
    this.getProfil();
    console.log("this.local_data",this.local_data);
    const userRole = this.local_data.role;
    if (userRole === 'ADHERENT') {
      // Do something based on the role
      console.log('User role is ADHERENT');
    }
    console.log("userRole", userRole);
    
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
        this.userRole = this.local_data.role;
        console.log("userRole", this.userRole);

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
        adresse: [this.local_data.adresse, Validators.required],
        telephone: [this.local_data.telephone, Validators.required],
        roleName: [this.local_data.roleName, Validators.required],
        nationalite: [this.local_data.nationalite, Validators.required],
        niveauScolaire: [this.local_data.niveauScolaire, Validators.required],

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