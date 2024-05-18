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
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Roles } from 'src/models/roles.model';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { PaiementService } from 'src/app/services/paiement.service';
import { Equipe } from 'src/models/equipe.model';
import { ChangePasswordChange } from 'src/models/changePassword.model';

@Component({
  selector: 'app-profil',

  //imports: [MaterialModule, TablerIconsModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
})
export class AppProfilComponent implements OnInit {
  managerForm: FormGroup;
  changePwdForm: FormGroup;
  local_data: any;
  action: string;
  equipes: string[];
  nomEquipeOptions: string[] = [];
  dataSource = new MatTableDataSource<string>([]);
  managerSource = new MatTableDataSource<Manager>([]);
  //dataSource = new MatTableDataSource<Manager>([]);
  userRole: string = '';
  isCurrentPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  
  validationError: string = '';
  serverSideError: string = '';

  constructor(
    private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    private managerService: ManagerService,
    private formBuilder: FormBuilder,
    private paiementService: PaiementService
  ) {
    this.local_data = { ...data };
    this.userRole = this.local_data.role;
    console.log('data', this.local_data);
    console.log('userRole', this.userRole);

    this.initManagerForm();
  }



  ngOnInit(): void {
    this.initManagerForm();
    this.dataSource = new MatTableDataSource<string>([]);
    this.getManagerProfil();
    this.getEquipeNames();
    this.initChangePwdForm();
    console.log('this.local_data', this.local_data);
    const userRole = this.local_data.role;
    const tel = this.local_data.telephone2;
    console.log("password",this.local_data.password);
    console.log('tel 2', this.local_data.telephone2);

    if (userRole === 'ADHERENT') {
      // Do something based on the role
      console.log('User role is ADHERENT');
    }
    console.log('userRole', userRole);
  }

  getManagerProfil(): void {
    this.managerService.getManagerProfil().subscribe(
      (profil) => {
        console.log('profil fetched successfully', profil);
        this.managerSource.data = profil;
        this.local_data = profil;
        console.log('this.local_data.data', this.local_data);
        console.log('local_data lastname', this.local_data.lastname);
        this.userRole = this.local_data.role;
        console.log('userRole', this.userRole);
        console.log("password",this.local_data.password);

        this.initManagerForm();
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  toggleCurrentPasswordVisibility(): void {
    this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  getEquipeNames(): void {
    this.paiementService.getEquipes().subscribe((equipes: Equipe[]) => {
      this.nomEquipeOptions = equipes.map((equipe: Equipe) => equipe.nom);
    });
  }

  initManagerForm(): void {
    this.managerForm = this.formBuilder.group({
      firstname: [this.local_data.firstname, Validators.required],
      lastname: [this.local_data.lastname, Validators.required],
      email: [this.local_data.email, Validators.required],
      dateNaissance: [this.local_data.dateNaissance, Validators.required],
      adresse: [this.local_data.adresse, Validators.required],
      telephone: [this.local_data.telephone, Validators.required],
      telephone2: [this.local_data.telephone2, Validators.required],
      roleName: [this.local_data.roleName, Validators.required],
      nationalite: [this.local_data.nationalite, Validators.required],
      niveauScolaire: [this.local_data.niveauScolaire, Validators.required],
      equipe: [this.local_data.equipe, Validators.required],
    });
  }

  initChangePwdForm(): void {
    this.changePwdForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  doAction(action: string): void {
    if(action==='ResetPWD'){
    if (this.changePwdForm.invalid) {
      this.displayValidationErrors();
      return;
    }

    const pwdData: ChangePasswordChange = this.changePwdForm.value;
    this.managerService.changePassword(pwdData).subscribe(
      (response) => {
        console.log('Password changed successfully', response);
        this.serverSideError = '';
      },
      (error) => {
        console.error('Error changing password', error);
        this.serverSideError = error.error.message; // Assuming the error message is in the 'message' field of the error response
      }
    );
  }
  else if (action === 'UpdateProfil'){
    const updatedManager = this.managerForm.value;
    console.log("updatedManager",updatedManager);
    
    this.managerService.updateManager(updatedManager).subscribe(
      (response) => {
        console.log('Manager updated successfully', response);
        console.log("updatedManager",updatedManager);
      },
      (error) => {
        console.error('Error updating manager', error);
      }
    );
  }
}

  displayValidationErrors(): void {
    const currentPassword = this.changePwdForm.get('currentPassword');
    const newPassword = this.changePwdForm.get('newPassword');
    const confirmPassword = this.changePwdForm.get('confirmPassword');

    if (currentPassword?.hasError('required')) {
      this.validationError = 'Current password is required.';
    } else if (newPassword?.hasError('required')) {
      this.validationError = 'New password is required.';
    } else if (newPassword?.hasError('minlength')) {
      this.validationError = 'New password must be at least 6 characters long.';
    } else if (confirmPassword?.hasError('required')) {
      this.validationError = 'Confirm password is required.';
    } else if (confirmPassword?.hasError('minlength')) {
      this.validationError = 'Confirm password must be at least 6 characters long.';
    } else if (this.changePwdForm.hasError('passwordMismatch')) {
      this.validationError = 'Passwords do not match.';
    } else {
      this.validationError = '';
    }
}
}
