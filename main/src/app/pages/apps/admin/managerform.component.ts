import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from 'src/app/services/manager.service';
import { ActivatedRoute } from '@angular/router';
import { Manager } from 'src/models/manager.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-manager-form',
  templateUrl: './managerform.component.html',
})
export class AppManagerFormComponent implements OnInit {
  action: string;
  local_data: any;
  managerForm: FormGroup;
  isPasswordVisible: boolean = false;
  manager: Manager;

  managerSource = new MatTableDataSource<Manager>();

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private managerService: ManagerService,
    private route: ActivatedRoute,
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.action = params['action'];
      const id = params['id'];
        this.getFormManagerById(id);
        this.initManagerForm();
      
    });
  }

  getFormManagerById(id: string): void {
    this.managerService.getFormManagerById(id).subscribe(
      (manager) => {
        this.local_data = manager; // Store the fetched manager data
        console.log("name", manager.firstname);
        console.log("this.local_data", this.local_data);
        this.initManagerForm(manager); // Initialize the form with the fetched manager data
      },
      (error) => {
        console.error('Error fetching manager', error);
      }
    );
  }

  initManagerForm(manager?: Manager): void {
    this.managerForm = this.formBuilder.group({
      firstname: [manager?.firstname || '', Validators.required],
      lastname: [manager?.lastname || '', Validators.required],
      email: [manager?.email || '', [Validators.required, Validators.email]],
      adresse: [manager?.adresse || '', Validators.required],
      telephone: [manager?.telephone || '', Validators.required],
      telephone2: [manager?.telephone2 || ''],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getManagers(): void {
    this.adminService.getManagers().subscribe(
      (managers) => {
        this.managerSource.data = managers;
      },
      (error) => {
        console.error('Error fetching managers', error);
      }
    );
  }

  fetchData(): void {
    this.adminService.getManagers().subscribe(data => {
      this.managerSource.data = data;
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
      this.adminService.addManager(this.managerForm.value).subscribe(
        (response) => {
          console.log('Manager added:', response);
        },
        (error) => {
          console.error('Error adding manager:', error);
        }
      );
    } else if (this.action === 'Update' && this.local_data) {
      const updatedManager = { ...this.managerForm.value, id: this.local_data.id };
      this.adminService.updateManager(updatedManager).subscribe(
        (response) => {
          console.log('Manager updated successfully', response);
        },
        (error) => {
          console.error('Error updating manager:', error);
        }
      );
    }
  }

  cancelAction(): void {
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  }
}
