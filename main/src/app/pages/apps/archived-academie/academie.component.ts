import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AcademieService } from 'src/app/services/academie.service';
import { Academie } from 'src/models/academie.model';
import { AcademieType } from 'src/models/enums/academie-type.model';
import { Etat } from 'src/models/enums/etat.model';

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
    'type',
    'description',
    'etat',
    'action'
  ];

  selectedSortingOption: string;
  selectedType: string | null = null;
  selectedEtat: string | null = null;
  typeOptions: string[] = Object.values(AcademieType).filter(value => typeof value === 'string').map(value => String(value));
  etatOptions2: string[] = Object.values(Etat).filter(value => typeof value === 'string').map(value => String(value));
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' }
  ];

  applySorting() {
    if (this.selectedSortingOption === 'asc') {
      this.dataSource.data.sort((a, b) => {
        const academieA = `${a.nom}`.toLowerCase();
        const academieB = `${b.nom}`.toLowerCase();
        return academieA.localeCompare(academieB);
      });
    } else if (this.selectedSortingOption === 'desc') {
      this.dataSource.data.sort((a, b) => {
        const academieA = `${a.nom}`.toLowerCase();
        const academieB = `${b.nom}`.toLowerCase();
        return academieB.localeCompare(academieA);
      });
    }
    // After sorting, reassign the sorted data to the dataSource
    this.dataSource = new MatTableDataSource<Academie>(this.dataSource.data);
  }

  // Helper function to check if a value matches the filter
  matchesFilter(value: any, filter: string): boolean {
    // Convert value to string if it's not already
    const stringValue = value ? value.toString().toLowerCase() : '';
    // Check if the string value contains the filter value
    return stringValue.includes(filter);
  }

  applyFilterByType(): void {
    // Apply the filter by Equipe if selectedEquipe is not null
    if (this.selectedType !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedType.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Academie, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.type, filter);
      };

      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedEquipe is null
      this.applyFilter('');
    }
  }

  applyFilterByEtat(): void {
    // Apply the filter by Equipe if selectedEquipe is not null
    if (this.selectedEtat !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedEtat.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Academie, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.etat, filter);
      };

      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedEquipe is null
      this.applyFilter('');
    }
  }

  resetFilters(): void {
    // Reset selected filters
    this.selectedType = null;
    this.selectedEtat = null;
    this.selectedSortingOption = '';
    this.getAcademies();

    // Apply filters again to refresh the data
    this.applyFilter('');
  }

  getEtatColor(etat: string): { backgroundColor: string } {
    switch (etat) {
      case 'INACTIF':
        return { backgroundColor: '#FEF5E5' };
      case 'ACTIF':
        return { backgroundColor: '#E6FFFA' };
      case 'SUSPENDU':
        return { backgroundColor: '#FDEDE8' };
      case 'FERME':
        return { backgroundColor: '#ECF2FF' };
      default:
        return { backgroundColor: 'inherit' }; // Or a default color
    }
  }

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
        this.getAcademies(); // Call getAcademies only after restoration is finished
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
