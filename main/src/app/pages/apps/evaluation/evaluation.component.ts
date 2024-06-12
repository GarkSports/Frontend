import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EquipeService } from 'src/app/services/equipe.service';
import { ManagerService } from 'src/app/services/manager.service';
import { StaffService } from 'src/app/services/staff.service';
import { Categorie } from 'src/models/categorie.model';
import { Equipe } from 'src/models/equipe.model';
import { Manager } from 'src/models/manager.model';
import { Test } from 'src/models/test.model';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaltest.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class AppEvaluationComponent implements OnInit {
  dataSource = new MatTableDataSource<Test>([]);
  testCards: Test[] = [];
  testForm: FormGroup;
  categoriesCards: any
  managerSource = new MatTableDataSource<Manager>([]);

  evaluationForm: FormGroup;
  isEvaluationFormVisible = false;
  evaluation: any = {}; // Define an object to store form data
  local_data: any;
  connectedUser: any;

  constructor(
    //public data: Equipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Equipe,
    private managerService: ManagerService,
    private staffService: StaffService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Test>([]);
    this.getProfil();
    console.log('testCards:', this.testCards);
    this.fetchCategories();
  }


  getProfil(): void {
    this.managerService.getProfil().subscribe(
      (profil) => {
        console.log('profil fetched successfully', profil);
        this.connectedUser = profil;
        this.getTest(this.connectedUser.academie.id);
      },
      (error) => {
        console.error('Error fetching profil', error);
      }
    );
  }

  


  getTest(academieId: number): void {
    this.staffService.getTests(academieId).subscribe(
      tests => {
        this.testCards = tests;
        this.dataSource.data = tests;
        this.local_data = tests;
        console.log("Tests: ", this.local_data);
        this.fetchCategories();
      },
      error => {
        console.error('Error fetching tests', error);
      }
    );
  }
  
  fetchCategories(): void {
    this.testCards.forEach(test => {
      test.categories.forEach(category => {
        this.categoriesCards.push(category);
      });
    });
  }

  getTotalKpis(test: Test): number {
    return test.categories.reduce((total, category) => total + category.kpis.length, 0);
  }

  openTest(action: string, obj: any): void{
    console.log("hello");
    const queryParams = new URLSearchParams({
      action,
      id: obj.id
    }).toString();
    const url = `/apps/test?${queryParams}`;
    window.location.href = url;
  }

  deleteTest(test: Test): void {
    if (confirm(`Are you sure you want to delete the test: ${test.testName}?`)) {
      this.staffService.deleteTest(test.id).subscribe(
        response => {
          console.log('Test deleted successfully', response);
          this.testCards = this.testCards.filter(t => t.id !== test.id); // Remove the deleted test from the list
          this.dataSource.data = this.testCards; // Update the data source
        },
        error => {
          console.error('Error deleting test', error);
        }
      );
    }
  }
  
  
  addTest(): void{
    const dialogRef = this.dialog.open(AppAddTestDialogContentComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getProfil();
      }
    });
  }

}


@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: './add-test-dialog.content.html',
})
// tslint:disable-next-line - Disables all
export class AppAddTestDialogContentComponent implements OnInit {
  dataSource = new MatTableDataSource<Test>([]);
  testCards: Test[] = [];
  testForm: FormGroup;
  categoriesCards: any
  managerSource = new MatTableDataSource<Manager>([]);
  action: string;
  evaluationForm: FormGroup;
  isEvaluationFormVisible = false;
  evaluation: any = {}; // Define an object to store form data
  local_data: any;
  connectedUser: any;
  academieId: number;

  constructor(
    public dialogRef: MatDialogRef<AppAddTestDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private staffService: StaffService,
    private managerService: ManagerService
  ) {
   

}

  ngOnInit(): void {
    this.getProfil();
    this.initTestForm();
    console.log("academie id", this.academieId);
    
  }

  initTestForm(): void {
    this.testForm = this.formBuilder.group({
      testName: ['', Validators.required],
      categories: this.formBuilder.array([]),
      academieId: [null, Validators.required]
    });
  }

  getProfil(): void {
    this.managerService.getProfil().subscribe(
      (profil) => {
        console.log('Profile fetched successfully', profil);
        this.connectedUser = profil;
        this.academieId = this.connectedUser.academie.id;
        this.testForm.patchValue({ academieId: this.academieId }); // Update the form with academieId
        console.log("Academie ID:", this.academieId);
      },
      (error) => {
        console.error('Error fetching profile', error);
      }
    );
  }

  get categories(): FormArray {
    return this.testForm.get('categories') as FormArray;
  }

  addCategorie(): void {
    this.categories.push(this.formBuilder.group({
      categorieName: ['', Validators.required],
      kpis: this.formBuilder.array([])
    }));
  }

  removeCategorie(index: number): void {
    this.categories.removeAt(index);
  }

  addKpi(categorieIndex: number): void {
    const categoryFormGroup = this.categories.at(categorieIndex) as FormGroup;
    const kpisFormArray = categoryFormGroup.get('kpis') as FormArray;
    kpisFormArray.push(this.formBuilder.group({
      kpiType: ['', Validators.required]
    }));
  }

  removeKpi(categorieIndex: number, kpiIndex: number): void {
    const categoryFormGroup = this.categories.at(categorieIndex) as FormGroup;
    const kpisFormArray = categoryFormGroup.get('kpis') as FormArray;
    kpisFormArray.removeAt(kpiIndex);
  }

  doAction(): void {
    if (this.testForm.valid) {
      const newTest = {
        testName: this.testForm.get('testName')?.value,
        categories: this.testForm.get('categories')?.value
      };

      const academieId = this.testForm.get('academieId')?.value;

      this.staffService.addTest(academieId, newTest).subscribe(
        response => {
          console.log('Test added successfully', response);
          this.dialogRef.close('success');
        },
        error => {
          console.error('Error adding test', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  closeDialog(): void {
    this.dialogRef.close('cancel');
  }
}