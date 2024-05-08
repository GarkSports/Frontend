import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EvenementService } from 'src/app/services/evenement.service';
import { ExtendedEventDTO } from 'src/models/dto/ExtendedEventDTO.model';
import { StatutEvenement } from 'src/models/enums/statutEvenenement.model';
import { Evenement } from 'src/models/evenement.model';

@Component({
  templateUrl: './listEvenement.component.html',
})
export class ListEvenementComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  selectedComponent: string = '/apps/listevenement';
  statutOptions: string[] = Object.values(StatutEvenement).filter(value => typeof value === 'string').map(value => String(value));

  displayedColumns: string[] = [
    'nom',
    'type',
    'equipe',
    'member',
    'date',
    'statut',
    'action'
  ];

  dataSource = new MatTableDataSource<ExtendedEventDTO>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public evenementService: EvenementService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getEvenements();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEvenements(): void {
    this.evenementService.extendEvents().subscribe(
      (extendedEvents) => {
        console.log('Extended events fetched successfully', extendedEvents);
        // Assuming dataSource is defined in your component
        this.dataSource.data = extendedEvents;
      },
      (error) => {
        console.error('Error fetching extended events', error);
      }
    );
  }


  openAddEvenementDialog(): void {
    const dialogRef = this.dialog.open(AddEvenementPopupComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  onStatusChange(evenement: Evenement): void {
    // Ensure evenement is not undefined and its ID is defined
    if (evenement && evenement.id !== undefined && evenement.statut !== undefined) {
      // Call the service method to update the status of the event
      this.evenementService.changeStatutEvenement(evenement.id, evenement.statut)
        .subscribe(updatedEvenement => {
          // Update the local copy of the event with the updated status
          evenement.statut = updatedEvenement.statut;
          // Optionally, you can show a success message or handle the updated event
          this.getEvenements();
          console.log('Status changed successfully:', updatedEvenement);
        }, error => {
          // Handle errors if any
          console.error('Error changing status:', error);
        });
    } else {
      console.error('Event or its ID is undefined.');
    }
  }



  getBackgroundColor(status: string): string {
    switch (status) {
      case 'Annulé':
        return '#FF1354'; // Red color for Non_Payé
      case 'Activé':
        return '#B7EF3F'; // Green color for Payé
      default:
        return ''; // Default background color
    }
  }

  getTextColor(status: string): string {
    switch (status) {
      case 'Annulé':
        return '#FFFFFF'; // White text color for Non_Payé
      case 'Activé':
        return '#000000'; // Black text color for Payé
      default:
        return ''; // Default text color
    }
  }

  onDeleteEvenement(idEvenement: number): void {
    const dialogRef = this.dialog.open(DeleteEventConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, perform the deletion here
        this.evenementService.deleteEvenement(idEvenement).subscribe(
          () => {
            console.log('Evenement deleted successfully!');
            this.getEvenements();
          },
          (error) => {
            console.error('Error deleting evenement:', error);
          }
        );
      }
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
    private router: Router
  ) { }

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


@Component({
  templateUrl: './confirmation-dialog.component.html',
})
export class DeleteEventConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteEventConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Close the dialog with 'false' value
  }

  onDeleteClick(): void {
    this.dialogRef.close(true); // Close the dialog with 'true' value
  }
}





