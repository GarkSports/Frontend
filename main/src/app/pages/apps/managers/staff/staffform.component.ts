import {
  Component,
  OnInit,
  Inject,
  Optional,
  ViewChild,
  OnDestroy,
} from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, RoleArray } from 'src/models/enums/role.model';
import { RoleName, RoleNameArray } from 'src/models/roleName.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSort } from '@angular/material/sort';
import { Observable, forkJoin } from 'rxjs';
import { PaiementService } from 'src/app/services/paiement.service';
import { Equipe } from 'src/models/equipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-form-content',
  templateUrl: './staffform.component.html',
})
// tslint:disable-next-line - Disables all
export class AppStaffformContentComponent implements OnInit, OnDestroy {
  private broadcastChannel: BroadcastChannel;

  action: string;
  local_data: any;
  managerForm: FormGroup;
  firstnameValue: string;
  roles: string[];
  roleNames: string[];

  dataSource = new MatTableDataSource<string>([]);
  managerSource = new MatTableDataSource<Manager>([]);

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { managerForm: FormGroup; data: Manager },
    private firestorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.broadcastChannel = new BroadcastChannel('staffFormChannel');
  }

  showRoleInput: boolean = false;
  photo: string;
  onRoleChange(event: MatSelectChange) {
    const selectedValue = event.value;
    this.showRoleInput =
      selectedValue === 'STAFF' || selectedValue === 'ENTRAINEUR';
    console.log('role', selectedValue);
  }

  displayedData: any[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.action = params['action'];
      const id = params['id'];
        this.getFormManagerById(id);
      this.getOnlyRoleNames();
      this.initManagerForm();

    });
  }


  ngOnDestroy(): void {
    this.broadcastChannel.postMessage('staffFormClosed');
    this.broadcastChannel.close();
  }

  getOnlyRoleNames(): void {
    this.managerService.getOnlyRoleNames().subscribe(
      (roleNames) => {
        console.log('Managers fetched successfully', roleNames);
        this.roleNames = roleNames;
        this.dataSource.data = roleNames;
        console.log(roleNames);
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.managerService.getOnlyRoleNames().subscribe(
      (roleNames) => {
        console.log('Managers fetched successfully', roleNames);
        this.dataSource.data = roleNames;
        console.log(roleNames);
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
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
      role: [manager?.role, Validators.required],
      roleName: [
        manager?.role === Role.ADHERENT || manager?.role === Role.PARENT
          ? null
          : manager?.roleName,
      ],
      photo: [manager?.photo],
      telephone: [manager?.telephone, Validators.required],
    });
  }

  getManagers(): void {
    this.managerService.getManagers().subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.managerSource.data = managers;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  doAction(): void {
    if (this.action === 'Add') {
      const role = this.managerForm.get('role')?.value;
      console.log('role', role);
      const addedManager = this.managerForm.value;

      let addObservable = new Observable<any>();
      switch (role) {
        case 'STAFF':
          if (this.managerForm.valid) {
            const managerWithPhoto = { ...addedManager, photo: this.photo };

            addObservable = this.managerService.addStaff(managerWithPhoto);
            console.log('photo 2', this.photo);
          } else {
            console.error(
              'Form is not valid. Please fill out all required fields.'
            );
          }
          break;
        case 'ENTRAINEUR':
          if (this.managerForm.valid) {
            const managerWithPhoto = { ...addedManager, photo: this.photo };
            addObservable = this.managerService.addEntraineur(managerWithPhoto);
          } else {
            console.error(
              'Form is not valid. Please fill out all required fields.'
            );
          }
          break;
        case 'ADHERENT':
          if (this.managerForm.valid) {
            const managerWithPhoto = { ...addedManager, photo: this.photo };
            addObservable = this.managerService.addAdherent(managerWithPhoto);
          } else {
            console.error(
              'Form is not valid. Please fill out all required fields.'
            );
          }
          break;

        case 'PARENT':
          break;

        default:
          console.error('Invalid role:', role);
          return; // Exit function if role is invalid
      }
      addObservable.subscribe(
        (response) => {
          console.log('Manager updated:', response);
        },
        (error) => {
          console.error('Error updating manager:', error);
        }
      );
    } else if (this.action === 'Update') {
      const updatedManager = this.managerForm.value;
      updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
      updatedManager.photo = this.local_data.photo;
      const role = updatedManager.role;
      let updateObservable;
      switch (role) {
        case 'STAFF':
          //const staffWithPhoto = { ...updatedManager, photo: this.photo2 };
          updateObservable = this.managerService.updateStaff(updatedManager);
          break;
        case 'ENTRAINEUR':
          //const entraineurWithPhoto = { ...updatedManager, photo: this.photo2 };
          updateObservable =
            this.managerService.updateEntraineur(updatedManager);
          break;
        case 'ADHERENT':
          const adherentWithPhoto = { ...updatedManager, photo: this.photo };

          updateObservable =
            this.managerService.updateAdherent(adherentWithPhoto);
          break;
        case 'PARENT':
          const parentWithPhoto = { ...updatedManager, photo: this.photo };

          updateObservable = this.managerService.updateParent(parentWithPhoto);
          break;
        default:
          console.error('Invalid role:', role);
          return; // Exit function if role is invalid
      }
      updateObservable.subscribe(
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
      // Optionally, you can navigate back to the previous page if the window wasn't opened as a popup
      window.history.back();
    }
  }

  async uploadFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.local_data.photo = reader.result as string;
    };

    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      this.local_data.photo = url;
    }
  }
}

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close (click)="cancelAction()">OK</button>
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
