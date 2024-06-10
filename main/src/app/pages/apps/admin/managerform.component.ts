import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
    private dialog: MatDialog
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
      (user) => {
  
        const manager = user as Manager;
        this.local_data = manager; // Store the fetched manager data
        console.log("name", user.firstname);
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
          this.showNotification(
            'Success',
            'Manager updated successfully!',
            'success'
          );
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              window.history.back();
            }
          }, 5000);
        },
        (error) => {
          console.error('Error adding manager:', error);
          this.showNotification('Error', 'Error adding manager', 'error');
        }
      );
    } else if (this.action === 'Update' && this.local_data) {
      const updatedManager = { ...this.managerForm.value, id: this.local_data.id };
      this.adminService.updateManager(updatedManager).subscribe(
        (response) => {
          console.log('Manager updated:', response);
          this.showNotification(
            'Success',
            'Manager updated successfully!',
            'success'
          );
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              window.history.back();
            }
          }, 5000);
        },
        (error) => {
          console.error('Error updating manager:', error);
          this.showNotification('Error', 'Error updating manager', 'error');
        }
      );
    }
  }

  showNotification(title: string, message: string, type: 'success' | 'error') {
    this.dialog.open(NotificationDialogComponent, {
      data: { title, message, type },
      panelClass: type, // You can use this to apply custom styles based on the type
    });
  }

  cancelAction(): void {
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  }
}

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h1 mat-dialog-title class="p-24 p-t-5">{{ data.title }}</h1>
    <div mat-dialog-content class="p-x-24 p-b-24">{{ data.message }}</div>
    <div mat-dialog-actions>
      <button mat-stroked-button class="p-24 p-t-0" (click)="cancelAction()">OK</button>
    </div>
  `,
  styles: [
    `
      h1 {
        color: #4caf50; /* Default to success color */
      }
      .error h1 {
        color: #f44336; /* Error color */
      }
    `,
  ],
})

export class NotificationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; type: 'success' | 'error' }
  ) {}

  cancelAction(): void {
    if (window.opener) {
      window.close();
    } else {
      // Optionally, you can navigate back to the previous page if the window wasn't opened as a popup
      window.history.back();
    }
  }
}
