import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EquipeService } from 'src/app/services/equipe.service';
import { EvenementService } from 'src/app/services/evenement.service';
import { Adherent } from 'src/models/adherent.model';
import { EvenementType } from 'src/models/enums/evenementType';
import { StatutEvenement } from 'src/models/enums/statutEvenenement.model';
import { Equipe } from 'src/models/equipe.model';
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

  typeEventsFilter: string[] = Object.values(EvenementType).filter(value => typeof value === 'string').map(value => String(value));
  equipes: Equipe[] = [];


  selectedEventTypes: string[] = [];
  selectedEquipes: string[] = [];

  showCheckboxes1: boolean = true;
  showCheckboxes2: boolean = true;

  displayedColumns: string[] = [
    'nom',
    'type',
    'equipe',
    'date',
    'statut',
    'action'
  ];

  dataSource = new MatTableDataSource<Evenement>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public evenementService: EvenementService,
    public equipeService: EquipeService,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getEvenements();
    this.getEquipes();
  }

  applyFilterByType(filterValue: string): void {
    if (this.selectedEventTypes.includes(filterValue)) {
      // If the filter value is already selected, remove it from the selectedEventTypes array
      this.selectedEventTypes = this.selectedEventTypes.filter(type => type !== filterValue);
    } else {
      // Otherwise, add the filter value to the selectedEventTypes array
      this.selectedEventTypes.push(filterValue);
    }

    // Set the filter predicate based on the selected event types
    this.dataSource.filterPredicate = (event: Evenement) => {
      // Check if event.type is not undefined
      if (event.type !== undefined) {
        // If no types are selected, show all events
        if (this.selectedEventTypes.length === 0) {
          return true;
        } else {
          // Check if the event type matches any of the selected types
          return this.selectedEventTypes.includes(event.type.toString());
        }
      }
      // Return false if event.type is undefined
      return false;
    };

    // Apply the filter value as an empty string to trigger the filterPredicate
    this.dataSource.filter = 'applyFilter';
  }

  applyFilterByEquipe(filterValue: string): void {
    if (this.selectedEquipes.includes(filterValue)) {
      // If the filter value is already selected, remove it from the selectedEquipes array
      this.selectedEquipes = this.selectedEquipes.filter(equipe => equipe !== filterValue);
    } else {
      // Otherwise, add the filter value to the selectedEquipes array
      this.selectedEquipes.push(filterValue);
    }

    // Set the filter predicate based on the selected teams
    this.dataSource.filterPredicate = (event: Evenement) => {
      // Check if event.equipe is not undefined
      if (event.convocationEquipe !== undefined && event.convocationEquipe?.nom !== undefined) {
        // If no teams are selected, show all events
        if (this.selectedEquipes.length === 0) {
          return true;
        } else {
          // Check if the event equipe matches any of the selected teams
          return this.selectedEquipes.includes(event.convocationEquipe.nom);
        }
      }
      // Return false if event.equipe is undefined
      return false;
    };

    // Apply the filter value as an empty string to trigger the filterPredicate
    this.dataSource.filter = 'applyFilter';
  }








  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleCheckboxesVisibility1() {
    this.showCheckboxes1 = !this.showCheckboxes1;
  }

  toggleCheckboxesVisibility2() {
    this.showCheckboxes2 = !this.showCheckboxes2;
  }

  getEvenements(): void {
    this.evenementService.getEvenements().subscribe(
      (evenements) => {
        console.log('evenements fetched successfully', evenements);
        // Assuming dataSource is defined in your component
        this.dataSource.data = evenements;
      },
      (error) => {
        console.error('Error fetching evenements', error);
      }
    );
  }

  getEquipes(): void {
    this.equipeService.getEquipes().subscribe(
      (equipes) => {
        console.log('equipes fetched successfully', equipes);
        // Assuming dataSource is defined in your component
        this.equipes = equipes;
      },
      (error) => {
        console.error('Error fetching equipes', error);
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

  onUpdateEvenement(evenement: Evenement): void {
    const dialogRef = this.dialog.open(UpdateEvenementPopupComponent, {
      data: evenement
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed update, refresh the list
        this.getEvenements();
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

@Component({
  selector: 'app-update-evenement-popup',
  templateUrl: './updateEvenement.component.html',
})
export class UpdateEvenementPopupComponent {
  memberList: Adherent[] = [];
  constructor(public dialogRef: MatDialogRef<UpdateEvenementPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public evenement: Evenement, private evenementService: EvenementService) { }



  ngOnInit(): void {
    this.getMembersByEvenement();
  }

  getMembersByEvenement(): void {
    if (this.evenement.id !== undefined) {
      this.evenementService.getMembersByEvent(this.evenement.id).subscribe(
        (members: Adherent[]) => {
          this.memberList = members;
        },
        (error: any) => {
          console.error('Error fetching members:', error);
        }
      );
    } else {
      console.error('Evenement ID is undefined');
    }
  }



  onCancelClick(): void {
    this.dialogRef.close();
  }
}





