import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog,} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Test} from 'src/models/test.model';
import {StaffService} from 'src/app/services/staff.service';
import {Categorie} from 'src/models/categorie.model';
import {Kpi} from 'src/models/kpi.model';
import {AppTestDialogContentComponent} from './testDialog.component';

@Component({
    // tslint:disable-next-line - Disables all
    selector: 'app-test-content',
    templateUrl: './test.component.html',
  })
  // tslint:disable-next-line - Disables all
export class AppTestContentComponent implements OnInit {
  color = 'primary';
  checked = false;
  disabled = false;
  action: string;
  dataSource = new MatTableDataSource<Test>([]);
  testCards: Test[] = [];
  testForm: FormGroup;
  isEvaluationFormVisible = false;
  evaluation: any = {}; // Define an object to store form data
  local_data: any;
  test: any;
  categories: Categorie[];
  selectedCategoryIndex: number | null = null;
  displayedInput: boolean= false;
  id: number;
  showCategorie: boolean= false;
  selectedCategoryToOpenIndex: number = -1;

  constructor(
    //public data: Equipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Test,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private staffService: StaffService,
  ) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
        this.action = params['action'];
        const id = params['id'];
        this.id = id;
        this.getTestById(this.id);
        this.initTestForm();
        this.dataSource = new MatTableDataSource<Test>([]);
        console.log(        this.local_data.testName        );
        this.getCategoriesByTestId(this.id);
        console.log("id", this.id);

      });
  }
  toggleCategoryView(index: number): void {
    this.selectedCategoryToOpenIndex = this.selectedCategoryToOpenIndex === index ? -1 : index;
  }

  logIt(categorieName: string, index: number): void {
    console.log("this is clicked category", categorieName);
    this.showCategorie = true;
    this.selectedCategoryToOpenIndex = index;
  }

  addCategorie(action: string, obj: any, testId: number): void {
    obj.action = action;
    obj.testId = testId; // Pass the testId to the dialog

    const dialogRef = this.dialog.open(AppTestDialogContentComponent, {
      data: {...obj, testForm: this.testForm}, width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getTestById(testId); // Refresh the test details if needed
      }
    });
  }

    deleteCategorie(test: Test, category: Categorie): void {
    if (confirm(`Are you sure you want to delete the category: ${category.categorieName}?`)) {
      this.staffService.deleteCategorie(category.id).subscribe(
        response => {
          console.log('Category deleted successfully', response);
          // Remove the deleted category from the test
          test.categories = test.categories.filter(c => c.id !== category.id);
        },
        error => {
          console.error('Error deleting category', error);
        }
      );
    }
  }


    getTestById(id: number): void{
    this.staffService.getTestById(id).subscribe(
        (test) => {
          this.local_data = test;
            this.initTestForm();
            this.test = test;
        }
    )
  }


  getCategoriesByTestId(id: number): void {
    this.staffService.getCategoriesByTestId(id).subscribe((categories) => {
      this.categories = categories;
      this.initTestForm();
    });
  }

  initTestForm(): void {
    this.testForm = this.formBuilder.group({
      testName: [this.test?.testName, Validators.required],
      categories: [this.test?.categories, Validators.required],
      kpis: [this.test?.categories.kpis, Validators.required],
      newKpiValue: ['', Validators.required],    });
  }


  deleteKpi(kpi: Kpi): void {
    if (confirm('Are you sure you want to delete this KPI?')) {
      this.staffService.deleteKpi(kpi.id).subscribe(() => {
       console.log("deleted");
        this.getTestById(this.id);
        console.log("id",this.id);

      });
    }
   }

  displayInput(): void {
    this.displayedInput = true;
  }
  selectCategory(index: number): void {
    this.selectedCategoryIndex = index;

  }

    addKpi(categorieId: number): void {
    const newKpiValue = this.testForm.get('newKpiValue')?.value;
    console.log("categorieId",categorieId);

      if (this.selectedCategoryIndex !== null && newKpiValue.trim() !== '') {
        this.staffService.addKpi(this.selectedCategoryIndex, newKpiValue.trim(), categorieId).subscribe(() => {
            this.testForm.get('newKpiValue')?.reset(); // Reset the newKpiValue form control
            this.selectedCategoryIndex = null; // Deselect the category
            this.getTestById(this.id);
        });
    }
}

}
