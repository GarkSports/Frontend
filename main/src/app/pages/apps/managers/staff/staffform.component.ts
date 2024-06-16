import {
  Component,
  OnInit,
  Inject,
  Optional,
  ViewChild,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
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
import { NgZone } from '@angular/core';

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
  form: FormGroup;
  firstnameValue: string;
  roles: string[];
  roleNames: string[];
  userRole: string;
  showParentInfo: boolean = false;
  ifAdherent: boolean = true;
  isAdherent: boolean = false;
  equipeList: Equipe[] = [];
  dataSource = new MatTableDataSource<string>([]);
  equipeDataSource = new MatTableDataSource<Equipe>([]);
  statutManagerValues = Object.values(StatutManager);
  user: any;
  showRoleInput: boolean = false;
  showNiveauScolaire: boolean = false;
  photo: string;
  displayedData: any[] = [];
  isLoading = false;
  selectedRole: string;
  selectedValue: string;
  email: string;
  assginedEquipes: Equipe[] = [];
  equipeNoms: string[] = [];
  error: string = '';
  initialEquipes: string[] = [];
  selectedEquipeNoms: string[] = [];
  assignedEquipes: Equipe[] = [];
  showEquipeInput: boolean = false;
  
  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private equipeService: EquipeService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private ngZone: NgZone
  ) {

  }



  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.action = params['action'];
      const id = params['id'];
      this.photo='';
      if(this.action==='Update'){
        this.getFormManagerById(id);
        console.log("id", id);
        // this.initAdherentForm(this.user); 
        // this.initManagerForm(this.user);
        this.initForm(this.user);
      }
      if(this.action==='Add'){
        // this.initAdherentForm();
        // this.initManagerForm();
        this.initForm();
      }
      this.getOnlyRoleNames();
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
  onRoleChange(event: Event): void {
    this.ngZone.run(() => {
      const selectElement = event.target as HTMLSelectElement;
      this.selectedRole = selectElement.value;
      console.log("Selected role:", this.selectedRole);

      switch (this.selectedRole) {
        case 'ENTRAINEUR':
          this.showRoleInput = true;
          this.showEquipeInput = true;
          this.showNiveauScolaire = false;
          break;
        case 'STAFF':
          this.showRoleInput = true;
          this.showNiveauScolaire = false;
          this.showEquipeInput = false;
          break;
        case 'ADHERENT':
          this.showRoleInput = false;
          this.showNiveauScolaire = true;
          this.isAdherent = true;
          this.showEquipeInput = true;
          break;
        default:
          break;
      }
    });
  }

  getEquipes(): void {
    this.equipeService.getEquipes().subscribe(
      (equipes) => {
        this.equipeList = equipes;
        this.equipeDataSource.data = this.equipeList;
        console.log('equipes all', this.equipeList);
        
        // Once all equipes are fetched, fetch the assigned equipes
      //   if(this.userRole==='ADHERENT')
      //  { this.getAssignedEquipesForAdherent(this.local_data?.id);}

        
           this.getAssignedEquipesForEntraineur(this.local_data?.id);

      },
      (error) => {
        console.error('Error fetching all equipes', error);
      }
    );
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

            if (this.local_data.role === 'ADHERENT') {
                const adherent = user as Adherent;
                this.isAdherent=true;
                this.userRole = 'ADHERENT';
                this.showNiveauScolaire = true;
                this.showEquipeInput=true;
                this.local_data = adherent;
                console.log("this.local_data", this.local_data);
                
                this.local_data.id = adherent.id;
                this.photo = adherent.photo;
                this.getAssignedEquipesForAdherent(adherent.id);
                
                const dateNaissance = new Date(adherent.dateNaissance);
                const today = new Date();
                const age = today.getFullYear() - dateNaissance.getFullYear();
                const monthDiff = today.getMonth() - dateNaissance.getMonth();

                if (age < 18 || (age === 18 && monthDiff < 0)) {
                    this.showParentInfo = true;
                } else {
                    this.showParentInfo = false;
                }
                this.ifAdherent = false;
            } else {
                const manager = user as Manager;
                this.userRole = 'MANAGER';
                this.local_data = manager;
                this.showEquipeInput=true;
                if(this.local_data.role==='STAFF'){
                  this.showEquipeInput=false;
                }
                console.log("role of staff", this.local_data.role);
                
                this.local_data.id = manager.id;
                this.photo = manager.photo;
                this.showRoleInput= true;
                //this.initManagerForm(manager);  // Initialize the manager form
                this.getAssignedEquipesForEntraineur(manager.id);  // Fetch the equipes before initializing the form
                //this.initManagerForm(this.local_data as Manager);
                const dateNaissance = new Date(manager.dateNaissance);
                const today = new Date();
                const age = today.getFullYear() - dateNaissance.getFullYear();
                const monthDiff = today.getMonth() - dateNaissance.getMonth();

                if (age < 18 || (age === 18 && monthDiff < 0)) {
                    this.showParentInfo = true;
                } else {
                    this.showParentInfo = false;
                }
            }
        },
        (error) => {
            console.error('Error fetching manager', error);
        }
    );
}

  // initManagerForm(manager?: Manager): void {
  //   const statut = manager?.blocked ? 'BLOCKED' : 'ACTIVE';
  //   const existingEquipeNoms = Array.isArray(this.equipeNoms) ? this.equipeNoms : (this.selectedEquipeNoms as string[]);

  //   this.managerForm = this.formBuilder.group({
  //     firstname: [this.local_data?.firstname || '', Validators.required],
  //     lastname: [manager?.lastname || '', Validators.required],
  //     email: [manager?.email || '', [Validators.required, Validators.email]],
  //     dateNaissance: [manager?.dateNaissance || '', Validators.required],
  //     adresse: [manager?.adresse || '', Validators.required],
  //     nationalite: [manager?.nationalite || '', Validators.required],
  //     role: [manager?.role || '', Validators.required],
  //     statut: [statut, Validators.required],
  //     equipes: [existingEquipeNoms || [], Validators.required],
  //     roleName: [
  //       manager?.role === Role.ADHERENT || manager?.role === Role.PARENT
  //         ? null
  //         : manager?.roleName,
  //     ],
  //     photo: [manager?.photo],
  //     telephone: [manager?.telephone, Validators.required],
  //   });
  // }

  // initForm(user: any): void{
  //   if (this.userRole==='ADHERENT'){
  //     this.initAdherentForm();
  //   } else{
  //     this.initManagerForm();
  //   }
  // }

  initForm(user?: any): void {
    const statut = user?.blocked ? 'BLOCKED' : 'ACTIVE';
    const existingEquipeNoms = this.equipeNoms || this.selectedEquipeNoms;  

    this.form = this.formBuilder.group({
      firstname: [user?.firstname || '', Validators.required],
      lastname: [user?.lastname || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      dateNaissance: [user?.dateNaissance || '', Validators.required],
      adresse: [user?.adresse || '', Validators.required],
      photo: [user?.photo || null],
      telephone: [user?.telephone || '', Validators.required],
      nationalite: [user?.nationalite || '', Validators.required],
      niveauScolaire: [user?.niveauScolaire || '', Validators.required],
      role: [user?.role || '', Validators.required],
      roleName: [user?.roleName|| '', Validators.required],
      equipes: [existingEquipeNoms || [], Validators.required],
      statut: [statut || '', Validators.required],
      informationsParent: this.formBuilder.group({
        nomParent: [user?.informationsParent?.nomParent || '', Validators.required],
        prenomParent: [user?.informationsParent?.prenomParent || '', Validators.required],
        telephoneParent: [user?.informationsParent?.telephoneParent || '', Validators.required],
        adresseParent: [user?.informationsParent?.adresseParent || '', Validators.required],
        emailParent: [user?.informationsParent?.emailParent || '', [Validators.required, Validators.email]],
        nationaliteParent: [user?.informationsParent?.nationaliteParent || '', Validators.required]
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
  onEquipeChange(event: MatSelectChange): void {
    this.selectedEquipeNoms = event.value;
    console.log("this equipe selected", this.selectedEquipeNoms);
    
  }
  
  // onEquipeChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const selectedOptions = Array.from(selectElement.selectedOptions)
  //     .map(option => option.value);
  //   this.selectedEquipeNoms = selectedOptions as string[]; // Type assertion
  //   console.log("This equipe selected:", this.selectedEquipeNoms);
  // }
  
 
  getAssignedEquipesForAdherent(id: number): void {
    this.managerService.getEquipesByAdherentEmail(id).subscribe(
      (assignedEquipes: Equipe[]) => {
        this.assignedEquipes = assignedEquipes;
        this.equipeNoms = assignedEquipes.map((equipe: Equipe) => equipe.nom);
        console.log('this.assignedEquipes', this.assignedEquipes);
        console.log('this.equipeNoms', this.equipeNoms);
        this.error = '';

        // Initialize the form with the assigned equipes
        this.initForm(this.local_data as Adherent);
      },
      (error) => {
        this.error = 'No equipes found or an error occurred';
      }
    );
}

getAssignedEquipesForEntraineur(id: number): void {
  this.managerService.getEquipesByEntraineurId(id).subscribe(
    (assignedEquipes: Equipe[]) => {
      this.assignedEquipes = assignedEquipes;
      this.equipeNoms = assignedEquipes.map((equipe: Equipe) => equipe.nom);
      console.log('this.assignedEquipes', this.assignedEquipes);
      console.log('this.equipeNoms', this.equipeNoms);
      this.error = '';
    
      this.initForm(this.local_data as Manager);
    },
    (error) => {
      this.error = 'No equipes found or an error occurred';
    }
  );
}
getInitials(): string {
  const firstname = this.form.get('firstname')?.value || '';
  const lastname = this.form.get('lastname')?.value || '';
  const firstInitial = firstname.charAt(0).toUpperCase();
  const lastInitial = lastname.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}



  doAction(): void {
    if (this.action === 'Add') {
      let addObservable = new Observable<any>();
      console.log(this.selectedRole);

      switch (this.selectedRole) {
        
        case 'STAFF':
          const addedStaff = this.form.value;
         
            const staffWithPhoto = { ...addedStaff, photo: this.photo };

            addObservable = this.managerService.addStaff(staffWithPhoto);
           
          break;

          case 'ENTRAINEUR':
            const addedManager = this.form.value;
            const equipeNamesForManager = this.form.get('equipes')?.value || [];
            const entraineurEquipesNames = equipeNamesForManager.length > 0 ? equipeNamesForManager : [];

            const entraineurWithPhoto = { ...addedManager, photo: this.photo };
            addObservable = this.managerService.addEntraineur(entraineurWithPhoto, entraineurEquipesNames);
          break;          

          case 'ADHERENT':
            const addedAdherent = this.form.value;
            const equipeNames = this.form.get('equipes')?.value || [];
            // Ensure that equipeNames are correctly mapped to their names
            const nomEquipes = equipeNames.length > 0 ? equipeNames : [];
            console.log("nomEquipes", nomEquipes);
          
            const adherentWithPhoto = { ...addedAdherent, photo: this.photo };
            addObservable = this.managerService.addAdherent(adherentWithPhoto, nomEquipes);
            break;
          
        case 'PARENT':
          break;

        default:
          console.error('Invalid role:');
          return; 
      }
      addObservable.subscribe(
        (response) => {
          console.log('Manager added:', response);
          this.showNotification(
            'Succèss',
            'Utilisateur ajouté avec Succès!',
            'success'
          );
          setTimeout(() => {
            this.router.navigate(['/apps/staff']);
          }, 5000);
        },
        (error) => {
          console.error('Error adding manager:', error);
          this.showNotification('Erreur', `Erreur lors du l'ajout d'utilisateur`, 'error');
        }
      );
    } else if (this.action === 'Update') {
      const role = this.local_data.role;
      let updateObservable;
      switch (role) {
        case 'STAFF':
          const updatedStaff = this.form.value;
          updatedStaff.id = this.local_data.id; 

          updatedStaff.photo = this.local_data.photo;
          //const staffWithPhoto = { ...updatedManager, photo: this.photo2 };
          updateObservable = this.managerService.updateStaff(updatedStaff);
          break;
        case 'ENTRAINEUR':
          const updatedEntraineur = this.form.value;
          updatedEntraineur.id = this.local_data.id;
          updatedEntraineur.photo = this.local_data.photo;
          const entraineurWithPhoto = { ...updatedEntraineur, photo: this.photo };
          updateObservable = this.managerService.updateEntraineur(entraineurWithPhoto, updatedEntraineur.equipes);
          break;
          case 'ADHERENT':
            const updatedAdherent = this.form.value;
            updatedAdherent.id = this.local_data.id;
            updatedAdherent.photo = this.local_data.photo;
            const adherentWithPhoto = { ...updatedAdherent, photo: this.photo };
            console.log("updatedAdherent.equipes", updatedAdherent.equipes);
            
            updateObservable = this.managerService.updateAdherent(adherentWithPhoto, updatedAdherent.equipes);
            break;
 
        default:
          console.error('Invalid role:', role);
          return; // Exit function if role is invalid
      }
      updateObservable.subscribe(
        (response) => {
          console.log('Manager updated:', response);
          this.showNotification(
            'Succèss',
            'Utilisateur mis à jour avec succès!',
            'success'
          );
          setTimeout(() => {
            this.router.navigate(['/apps/staff']);
          }, 5000);
        },
        (error) => {
          console.error('Error updating manager:', error);
          this.showNotification('Erreur', `Erreur lors du mis à jour d'utilisateur`, 'error');
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
    <div mat-dialog-actions class="p-24 p-t-0">
      <button mat-stroked-button (click)="cancelAction()">OK</button>
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
