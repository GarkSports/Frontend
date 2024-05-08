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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Roles } from 'src/models/roles.model';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
})
export class AppProfilComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
  Object.create(null);
   action: string;
   local_data: any;
   managerForm: FormGroup;

   managerSource = new MatTableDataSource<Manager>([]);

    constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AppProfilComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
      private managerService: ManagerService,
      private formBuilder: FormBuilder,
    ) {
      this.local_data = { ...data };
      this.action = this.local_data.action ;
    if (this.action === 'Update') {
      this.initManagerForm();
    }
    }

    ngOnInit(): void {
      this.getProfil();
    }

    initManagerForm(): void {
      this.managerForm = this.fb.group({
        firstname: [this.local_data.firstname, Validators.required],
        lastname: [this.local_data.lastname, Validators.required],
        email: [this.local_data.email, [Validators.required, Validators.email]],
        adresse: [this.local_data.adresse, Validators.required],
        role: [this.local_data.role, Validators.required],
        roleName: this.local_data.role === 'ADHERENT' || 'PARENT' ? null : [this.local_data.roleName],
        photo: [null] 
        });
  
    }

    getProfil(): void{
      this.managerService.getProfil().subscribe(
        (profil) => {
          console.log('profil fetched successfully', profil);
          this.managerSource.data = profil;
          console.log("source", profil);
          
        },
        (error) => {
          console.error('Error fetching academies', error);
        }
      );
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

 
