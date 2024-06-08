import { Component, Inject, Optional } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StaffService } from "src/app/services/staff.service";

@Component({
  selector: 'app-dialog-content',
  templateUrl: './test-dialog.content.html',
})
export class AppTestDialogContentComponent {
  action: string;
  local_data: any;
  testForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppTestDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private staffService: StaffService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    this.testForm = this.fb.group({
      categorieName: ['', Validators.required],
      kpis: this.fb.array([]),
      testId: [this.local_data.testId || null, Validators.required]
    });

    if (this.local_data.testId) {
      this.testForm.patchValue({ testId: this.local_data.testId });
    }
  }

  get kpis(): FormArray {
    return this.testForm.get('kpis') as FormArray;
  }

  addKpi(): void {
    this.kpis.push(this.fb.control(''));
  }

  removeKpi(index: number): void {
    this.kpis.removeAt(index);
  }

  doAction(): void {
    if (this.action === 'AddCat') {
      const newCategorie = {
        categorieName: this.testForm.get('categorieName')?.value,
        kpis: this.testForm.get('kpis')?.value
      };

      const testId = this.testForm.get('testId')?.value;

      this.staffService.addCategorie(testId, newCategorie).subscribe(
        response => {
          console.log('Category added successfully', response);
          this.dialogRef.close('success');
        },
        error => {
          console.error('Error adding category', error);
        }
      );
    } else {
      this.dialogRef.close('cancel');
    }
  }

  closeDialog(): void {
    this.dialogRef.close('cancel');
  }
}
