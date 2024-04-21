import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AcademieService } from 'src/app/services/academie.service';
import { Academie } from 'src/models/academie.model';

@Component({
  templateUrl: './academie.component.html',
})
export class ArchivedAcademieComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'nom',
    'logo',
    'description',
    'type',
    'action'
  ];

  dataSource = new MatTableDataSource<Academie>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public academieService: AcademieService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getAcademies();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getAcademies(): void {
    this.academieService.getArchivedAcademies().subscribe(
      (academies) => {
        console.log('Academies fetched successfully', academies);
        this.dataSource.data = academies;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ArchivedAcademieConfirmationDialogComponent, {
      data: id, // Pass the ID directly to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteAcademie(id); // Call deleteAcademie if result is true
        window.location.reload();
      }
    });
  }

  openDialogRestore(id: number): void {
    const dialogRef = this.dialog.open(ArchivedAcademieConfirmationRestoreDialogComponent, {
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.restoreAcademie(id); // Call restoreAcademie if result is true
        window.location.reload();
      }
    });
  }



  deleteAcademie(id: number): void {
    this.academieService.deleteArchivedAcademie(id).subscribe(
      () => {
        // Optional: Reload data or perform other actions after successful deletion
        console.log('Academy deleted successfully');
        this.getAcademies();
      },
      (error) => {
        console.error('Error deleting academy', error);
      }
    );
  }

  restoreAcademie(id: number): void {
    this.academieService.restoreArchivedAcademie(id).subscribe(
      () => {
        console.log('Academy restored successfully');
        this.getAcademies();
      },
      (error) => {
        console.error('Error restoring academy', error);
      }
    );
  }
}



@Component({
  templateUrl: './confirmation-dialog.component.html',
})
export class ArchivedAcademieConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ArchivedAcademieConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Close the dialog with 'false' value
  }

  onDeleteClick(): void {
    this.dialogRef.close(true); // Close the dialog with 'true' value
  }
}

@Component({
  templateUrl: './confirmationRestore-dialog.html',
})
export class ArchivedAcademieConfirmationRestoreDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ArchivedAcademieConfirmationRestoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Close the dialog with 'false' value
  }

  onRestoreClick(): void {
    this.dialogRef.close(true); // Close the dialog with 'true' value
  }
}
