import {
  Component,
  OnInit,
  Inject,
  Optional,
  ViewChild,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA
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
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, RoleArray } from 'src/models/enums/role.model';
import { RoleName, RoleNameArray } from 'src/models/roleName.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSort } from '@angular/material/sort';
import { Observable, forkJoin } from 'rxjs';
import { PaiementService } from 'src/app/services/paiement.service';
import { Equipe } from 'src/models/equipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { Adherent } from 'src/models/adherent.model';
import isThisHour from 'date-fns/isThisHour';
import { EquipeService } from 'src/app/services/equipe.service';
import { StatutManager } from 'src/models/enums/statutManager';

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
  equipeList: Equipe[] = [];
  dataSource = new MatTableDataSource<string>([]);
  equipeDataSource = new MatTableDataSource<Equipe>([]);
  statutManagerValues = Object.values(StatutManager);
  user: Manager;
  showRoleInput: boolean = false;
  showNiveauScolaire: boolean = false;
  photo: string;
  displayedData: any[] = [];
  isLoading = false;

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private equipeService: EquipeService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {

  }



  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.action = params['action'];
      const id = params['id'];
      this.photo='';
      this.getFormManagerById(id);
      this.initAdherentForm();
      this.getOnlyRoleNames();
      this.initManagerForm();
      this.getEquipes();
      

    });
  }

  deleteUser(): void{
    if (confirm(`Are you sure you want to delete the category: ?`)) {
      this.managerService.deleteUser(this.local_data.id).subscribe(
        response => {
          console.log('Category deleted successfully', response);
          // Remove the deleted category from the test
        },
        error => {
          console.error('Error deleting category', error);
        }
      );
    }
  }

  onRoleChange(event: MatSelectChange) {
    const selectedValue = event.value;
    this.showRoleInput =
      selectedValue === 'STAFF' || selectedValue === 'ENTRAINEUR';
    this.showNiveauScolaire = 
    selectedValue === 'ADHERENT' || selectedValue === 'PARENT';
  }

  getEquipes(): void {
    this.equipeService.getEquipes().subscribe(equipes => {
      this.equipeList = equipes;
      this.equipeDataSource.data = this.equipeList;
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
          this.local_data.id=adherent.id;
          this.photo=adherent.photo;
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
              this.local_data.id=manager.id;
              this.photo=manager.photo;

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
    const statut = manager?.blocked ? 'BLOCKED' : 'ACTIVE';

    this.managerForm = this.formBuilder.group({
      firstname: [manager?.firstname || '', Validators.required],
      lastname: [manager?.lastname || '', Validators.required],
      email: [manager?.email || '', [Validators.required, Validators.email]],
      dateNaissance: [manager?.dateNaissance || '', Validators.required],
      adresse: [manager?.adresse || '', Validators.required],
      role: [manager?.role, Validators.required],
      statut: [statut, Validators.required],
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
    const statut = adherent?.blocked ? 'BLOCKED' : 'ACTIVE';

    this.adherentForm = this.formBuilder.group({
      firstname: [adherent?.firstname || '', Validators.required],
      lastname: [adherent?.lastname || '', Validators.required],
      email: [adherent?.email || '', [Validators.required, Validators.email]],
      dateNaissance: [adherent?.dateNaissance || '', Validators.required],
      adresse: [adherent?.adresse || '', Validators.required],
      photo: [adherent?.photo || null],
      telephone: [adherent?.telephone, Validators.required],
      equipes: [adherent?.nomEquipe, Validators.required],
      nationalite: [adherent?.nationalite, Validators.required],
      niveauScolaire: [adherent?.niveauScolaire, Validators.required],
      statut: [statut, Validators.required],
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

  onStatutChange(event: MatSelectChange): void {
    const newStatut = event.value;
  
    // Update the local_data's blocked status based on the selected statut
    this.local_data.blocked = (newStatut === 'BLOCKED');
  
    // Determine the action to take based on the new blocked status
    const blockAction = this.local_data.blocked ? 'blockManager' : 'unBlockManager';
  
    // Call the appropriate service method
    this.managerService[blockAction](this.local_data.id).subscribe(
      (response: any) => {
        console.log('Manager action successful', response);
      },
      (error: any) => {
        console.error('Error', error);
      }
    );
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
    this.isLoading = true;
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      this.photo = url;
      console.log("photo", this.photo);
    }
    this.isLoading = false; 
  } 
  openPhotoDialog(): void {
    const dialogRef = this.dialog.open(PhotoDialogComponent, {
      data: { photo: this.photo },
      panelClass: 'photo-dialog-panel' // Optional: Add a custom class for additional styling
    });
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

@Component({
  selector: 'app-form-content',
  templateUrl: './photo-dialog-component.html',

})
export class PhotoDialogComponent {
  photo: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { photo: string }) {
    this.photo = data.photo;
  }
}
