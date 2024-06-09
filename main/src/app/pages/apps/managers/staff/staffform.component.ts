import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog,} from '@angular/material/dialog';
import {Manager} from 'src/models/manager.model';
import {ManagerService} from 'src/app/services/manager.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from 'src/models/enums/role.model';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Adherent} from 'src/models/adherent.model';

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-form-content',
  templateUrl: './staffform.component.html',
})
// tslint:disable-next-line - Disables all
export class AppStaffformContentComponent implements OnInit {

  action: string;
  local_data: any;
  managerForm: FormGroup;
  adherentForm: FormGroup;
  firstnameValue: string;
  roles: string[];
  roleNames: string[];
  showParentInfo: boolean = false;
  ifAdherent: boolean = true;
  isAdherent: boolean = false;


  dataSource = new MatTableDataSource<string>([]);

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {

  }

  showRoleInput: boolean = false;
  photo: string;

  onRoleChange(event: any) {
    const selectedValue = event.target.value;
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
      this.initAdherentForm();
      this.getOnlyRoleNames();
      this.initManagerForm();
    });
  }

  checkAge(event: any) {
    const dateOfBirth = new Date(event.target.value);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (age < 18 || (age === 18 && monthDiff < 0)) {
      this.showParentInfo = true;
      console.log('User is under 18 years old');
    } else {
      this.showParentInfo = false;
      console.log('User is 18 years old or older');
    }
  }

  checkAgeOnInit(dateNaissance: Date) {
    const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();
    const monthDiff = today.getMonth() - dateNaissance.getMonth();
    console.log(age);

    if (age < 18 || (age === 18 && monthDiff < 0)) {
      this.showParentInfo = true;
      console.log('User is under 18 years old');
    } else {
      this.showParentInfo = false;
      console.log('User is 18 years old or older');
    }
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
      (user) => {
        this.local_data = user;

        if(this.local_data.role === 'ADHERENT'){
          const adherent = user as Adherent;
          this.local_data = adherent;
          this.initAdherentForm(adherent);
          const dateNaissance = new Date(adherent.dateNaissance);
          console.log(dateNaissance);

          const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();
    const monthDiff = today.getMonth() - dateNaissance.getMonth();
    console.log(age);

          if (age < 18 || (age === 18 && monthDiff < 0)) {
      this.showParentInfo = true;
      console.log('User is under 18 years old');
    } else {
      this.showParentInfo = false;
      console.log('User is 18 years old or older');
    }
          this.ifAdherent = false;
          this.isAdherent = true;
        }
      else {
        const manager = user as Manager;
          this.local_data = manager;
          this.initManagerForm(manager);
        console.log("manager",manager);
        console.error('User is not a manager nor adherent');
        console.log("role is",manager.role);
        console.log("type of",typeof(manager));
        console.log("role adh",Role.MANAGER);
        console.log(manager.role===Role.MANAGER?'oui':'non');

        }
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
      dateNaissance: [manager?.dateNaissance || '', Validators.required],
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

  initAdherentForm(adherent?: Adherent): void {
    this.adherentForm = this.formBuilder.group({
      firstname: [adherent?.firstname || '', Validators.required],
      lastname: [adherent?.lastname || '', Validators.required],
      email: [adherent?.email || '', [Validators.required, Validators.email]],
      dateNaissance: [adherent?.dateNaissance || '', Validators.required],
      adresse: [adherent?.adresse || '', Validators.required],
      photo: [adherent?.photo || null],
      telephone: [adherent?.telephone, Validators.required],
      informationsParent: this.formBuilder.group({
        nomParent: [adherent?.informationsParent?.nomParent || '', Validators.required],
        prenomParent: [adherent?.informationsParent?.prenomParent || '', Validators.required],
        telephoneParent: [adherent?.informationsParent?.telephoneParent || '', Validators.required],
        adresseParent: [adherent?.informationsParent?.adresseParent || '', Validators.required],
        emailParent: [adherent?.informationsParent?.emailParent || '', [Validators.required, Validators.email]],
        nationaliteParent: [adherent?.informationsParent?.nationaliteParent || '', Validators.required]
      })
    });
  }


  doAction(): void {
    const form = this.isAdherent ? this.adherentForm : this.managerForm;

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
    } else if (this.action === 'Update') {
      const updatedManager = this.managerForm.value;
      const updatedAdherent = this.adherentForm.value;
      console.log(updatedAdherent);
      updatedAdherent.id = this.local_data.id;
      updatedAdherent.photo = this.local_data.photo;

      updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
      updatedManager.photo = this.local_data.photo;
      const role = this.local_data.role;
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
          const adherentWithPhoto = { ...updatedAdherent, photo: this.photo };

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
      window.history.back();
    }
  }

  async uploadFile(event: any) {
    if (!event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    const mimeType = file.type;

    if (!mimeType.startsWith('image/')) {
      // Handle error if the file is not an image
      return;
    }

    // Display image
    const reader = new FileReader();
    reader.onload = () => {
      this.local_data.imagePath = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Upload image
    const path = `academie/${file.name}`;
    try {
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();

      this.photo = url;
      // this.managerForm.setValue({ photo: url });
      // Set the photo URL to the form control
      this.adherentForm.patchValue({ photo: url });
    } catch (error) {
      console.error('Error uploading file:', error);
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
