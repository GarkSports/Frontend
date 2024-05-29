import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Manager } from 'src/models/manager.model';
import { AdminService } from 'src/app/services/admin.service';
import { DatePipe } from '@angular/common';
import { Academie } from 'src/models/academie.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from 'src/app/services/manager.service';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { StatutManager } from 'src/models/enums/statutManager';
import { AcademieService } from 'src/app/services/academie.service';

@Component({
    // tslint:disable-next-line - Disables all
    selector: 'app-manager-form',
    templateUrl: './managerform.component.html',
  })
  // tslint:disable-next-line - Disables all
  export class AppManagerFormComponent implements OnInit {
    action: string;
    local_data: any;
    managerForm: FormGroup;
    firstnameValue: string;
    isPasswordVisible: boolean = false;
  
    dataSource = new MatTableDataSource<Manager>([]);
  
    constructor(

      @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
      private formBuilder: FormBuilder,
      private adminService: AdminService,
      private managerService: ManagerService
    ) {
      this.local_data = { ...data };
      this.action = this.local_data.action ;
      if (this.action === 'Update') {
        this.initManagerForm();
      }
    }
    displayedData: any[] = [];
  
    ngOnInit(): void {
      this.initManagerForm();
    }
  
    initManagerForm(): void {
      this.managerForm = this.formBuilder.group({
        firstname: [this.local_data.firstname, Validators.required],
        lastname: [this.local_data.lastname, Validators.required],
        email: [this.local_data.email, [Validators.required, Validators.email]],
        adresse: [this.local_data.adresse, Validators.required],
        telephone: [this.local_data.telephone, Validators.required],
        telephone2: [this.local_data.telephone2],
        password: ['', [Validators.required]]
  
      });
    }
    togglePasswordVisibility(): void {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
    getManagers(): void {
      this.adminService.getManagers().subscribe(
        (managers) => {
          console.log('Managers fetched successfully', managers);
          this.dataSource.data = managers;
        },
        (error) => {
          console.error('Error fetching academies', error);
        }
      );
    }
  
    fetchData() {
      // Call your service to fetch the data
      this.adminService.getManagers().subscribe(data => {
        this.displayedData = data;
        this.dataSource = new MatTableDataSource(this.displayedData);
        //this.dataSource.sort = this.sort;
      });
    }
  
    doAction(): void {
      if (this.action === 'Add') {
        this.adminService.addManager(this.managerForm.value).subscribe(
          
          (response) => {
            console.log(this.managerForm.value);
            console.log('Manager added:', response);
   
          },
          (error) => {
            // Handle error
            console.error('Error adding manager:', error);
          }
        );
     
      } else if (this.action === 'Update') {
        // Handle Update action
        
          const updatedManager = this.managerForm.value;
          updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
          
          this.adminService.updateManager(updatedManager).subscribe(
            (response) => {
              console.log('Manager updated successfully', response);
              console.log('Manager updated:', response);
            },
            (error) => {
              console.error('Error updating manager', error);
            }
          );
        
      } 
      
        
    }
    
    cancelAction(): void {
        if (window.opener) {
          window.close();
        } else {
          // Optionally, you can navigate back to the previous page if the window wasn't opened as a popup
          window.history.back();
        }
      }

  }