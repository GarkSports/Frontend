import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddDisciplineComponent } from './add/add.component';
import { Discipline } from 'src/models/discipline.model';
import { DisciplineService } from 'src/app/services/discipline.service';

@Component({
  templateUrl: './discipline.component.html',
})
export class DisciplineComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = ['#', 'nom', 'description', 'action'];
  dataSource = new MatTableDataSource<Discipline>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public disciplineService: DisciplineService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getDisciplines();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppDisciplineDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Discipline): void {
    this.disciplineService.addDiscipline(row_obj).subscribe(
      (response) => {
        console.log('Discipline added successfully', response);
        this.getDisciplines(); // Refresh the data after adding
      },
      (error) => {
        console.error('Error adding discipline', error);
        // Handle error, if needed
      }
    );
  }

  updateRowData(row_obj: Discipline): void {
    this.disciplineService.updateDiscipline(row_obj.id, row_obj).subscribe(
      (response) => {
        console.log('Discipline updated successfully', response);
        this.getDisciplines(); // Refresh the data after updating
      },
      (error) => {
        console.error('Error updating discipline', error);
        // Handle error, if needed
      }
    );
  }

  deleteRowData(row_obj: Discipline): void {
    this.disciplineService.deleteDiscipline(row_obj.id).subscribe(
      (response) => {
        console.log('Discipline deleted successfully', response);
        this.getDisciplines(); // Refresh the data after deleting
      },
      (error) => {
        console.error('Error deleting discipline', error);
        // Handle error, if needed
      }
    );
  }

  getDisciplines(): void {
    this.disciplineService.getDisciplines().subscribe(
      (disciplines) => {
        console.log('Disciplines fetched successfully', disciplines);
        this.dataSource.data = disciplines;
      },
      (error) => {
        console.error('Error fetching disciplines', error);
      }
    );
  }
}

@Component({
  selector: 'app-discipline-dialog-content',
  templateUrl: 'discipline-dialog-content.html',
})
export class AppDisciplineDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppDisciplineDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Discipline
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd'
      );
    }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}
