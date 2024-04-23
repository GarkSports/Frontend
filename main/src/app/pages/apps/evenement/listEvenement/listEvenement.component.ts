import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Evenement } from 'src/models/evenement.model';

@Component({
  templateUrl: './listEvenement.component.html',
})
export class ListEvenementComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  selectedComponent: string = '/apps/listevenement';

  displayedColumns: string[] = [
    'nom',
    'description',
    'lieu',
  ];

  dataSource = new MatTableDataSource<Evenement>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddEvenementDialog(): void {
    const dialogRef = this.dialog.open(AddEvenementPopupComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}

@Component({
  templateUrl: './addEvenement.component.html',
})
export class AddEvenementPopupComponent {
  selectedOption: string;

  constructor(
    public dialogRef: MatDialogRef<AddEvenementPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router:Router
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  navigateToSelectedOption(): void {
    if (this.selectedOption === 'Competition') {
      this.router.navigate(['/apps/addcompetition']);
    }
    if (this.selectedOption === 'personnalise') {
      this.router.navigate(['/apps/addpersonnalise']);
    }
    if (this.selectedOption === 'test') {
      this.router.navigate(['/apps/addtest']);
    }
    if (this.selectedOption === 'match amical') {
      this.router.navigate(['/apps/addmatchamical']);
    }
  }
}





