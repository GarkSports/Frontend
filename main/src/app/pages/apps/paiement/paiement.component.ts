import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Paiement } from 'src/models/paiement.model';
import { PaiementService } from 'src/app/services/paiement.service';
import { TypeAbonnement } from 'src/models/enums/typeAbonnement.model';
import { Adherent } from 'src/models/adherent.model';
import { PaiementHistory } from 'src/models/paiementHistory.model';
import { StatutAdherent } from 'src/models/enums/statutAdherent.model';
import { Equipe } from 'src/models/equipe.model';

@Component({
  templateUrl: './paiement.component.html',
})
export class PaiementComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'membre',
    'equipe',
    'telephone',
    'type_abonnement',
    'date_abonnement',
    'statut',
    'actions'
  ];
  statutOptions: string[] = Object.values(StatutAdherent).filter(value => typeof value === 'string').map(value => String(value));
  typeAbonnements: string[] = Object.values(TypeAbonnement).filter(value => typeof value === 'string').map(value => String(value));
  selectedType: string | null = null;
  selectedStatut: string | null = null;
  selectedEquipe: string | null = null;
  equipeOptions: string[] = [];
  dataSource = new MatTableDataSource<Paiement>([]);
  paiementList: Paiement[] = [];
  paiement: Paiement;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private paiementService: PaiementService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    // Convert filter value to lowercase for case-insensitive comparison
    const filter = filterValue.trim().toLowerCase();

    // Set filter function for data source
    this.dataSource.filterPredicate = (data: Paiement, filter: string) => {
      // Check if any attribute matches the filter value
      return (
        this.matchesFilter(data.adherent?.firstname, filter) ||
        this.matchesFilter(data.adherent?.nomEquipe, filter) ||
        this.matchesFilter(data.adherent?.telephone, filter) ||
        this.matchesFilter(data.typeAbonnement, filter) ||
        this.matchesFilter(data.dateFin, filter) ||
        this.matchesFilter(data.adherent?.statutAdherent, filter)
      );
    };

    // Apply the filter
    this.dataSource.filter = filter;
  }

  // Helper function to check if a value matches the filter
  matchesFilter(value: any, filter: string): boolean {
    // Convert value to string if it's not already
    const stringValue = value ? value.toString().toLowerCase() : '';
    // Check if the string value contains the filter value
    return stringValue.includes(filter);
  }

  applyFilterByType(): void {
    // Apply the filter by Type Abonnement if selectedType is not null
    if (this.selectedType !== null) {
      this.applyFilter(this.selectedType);
    } else {
      // Reset the filter if selectedType is null
      this.applyFilter('');
    }
  }

  applyFilterByStatut(): void {
    // Apply the filter by Statut if selectedStatut is not null
    if (this.selectedStatut !== null) {
      // Convert the selectedStatut to lowercase for case-insensitive comparison
      const filter = this.selectedStatut.trim().toLowerCase();
  
      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Paiement, filter: string) => {
        // Check if the statut matches the filter value exactly
        return data.adherent?.statutAdherent.toString().toLowerCase() === filter;
      };
  
      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedStatut is null
      this.applyFilter('');
    }
  }
  

  // Inside the Component Class
  applyFilterByEquipe(): void {
    // Apply the filter by Equipe if selectedEquipe is not null
    if (this.selectedEquipe !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedEquipe.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Paiement, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.adherent?.nomEquipe, filter);
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
    this.selectedStatut = null;
    this.selectedEquipe = null;

    // Apply filters again to refresh the data
    this.applyFilter('');
  }

  ngOnInit(): void {
    this.getPaiements();
    this.getEquipeNames();
  }

  getEquipeNames(): void {
    this.paiementService.getEquipes().subscribe((equipes: Equipe[]) => {
      this.equipeOptions = equipes.map((equipe: Equipe) => equipe.nom);
    });
  }

  getPaiements(): void {
    this.paiementService.getPaiements().subscribe(paiements => {
      this.paiementList = paiements;
      this.dataSource.data = this.paiementList;
    });
  }

  onStatusChange(paiement: Paiement): void {
    if (paiement.adherent) {
      const statutAdherentString = StatutAdherent[paiement.adherent.statutAdherent]; // Convert enum to string
      this.paiementService.changeStatutAdherent(paiement.adherent.id, statutAdherentString)
        .subscribe(updatedAdherent => {
          // Handle success or error response
          console.log('Status changed successfully:', updatedAdherent);
          // If necessary, update the local copy of the paiement with the updated adherent's status
          paiement.adherent!.statutAdherent = updatedAdherent.statutAdherent;
        }, error => {
          console.error('Error changing status:', error);
          // If there's an error, you might want to handle it or display a message to the user
        });
    } else {
      console.error('Adherent is undefined.');
    }
  }

  getBackgroundColor(status: string): string {
    switch (status) {
      case 'Non_Payé':
        return '#FF1354'; // Red color for Non_Payé
      case 'Payé':
        return '#B7EF3F'; // Green color for Payé
      case 'Gratuit':
        return '#B156CF'; // Purple color for Gratuit
      case 'Payé_Partiellement':
        return '#FFD700'; // Gold color for Payé_partiellement
      default:
        return ''; // Default background color
    }
  }
  
  getTextColor(status: string): string {
    switch (status) {
      case 'Non_Payé':
        return '#FFFFFF'; // White text color for Non_Payé
      case 'Payé':
        return '#000000'; // Black text color for Payé
      case 'Gratuit':
        return '#FFFFFF'; // White text color for Gratuit
      case 'Payé_Partiellement':
        return '#000000'; // Black text color for Payé_partiellement
      default:
        return ''; // Default text color
    }
  }  

  onDeletePaiement(idPaiement: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this paiement?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, perform the deletion here
        this.paiementService.deletePaiement(idPaiement).subscribe(
          () => {
            console.log('Paiement deleted successfully!');
            this.getPaiements();
          },
          (error) => {
            console.error('Error deleting paiement:', error);
          }
        );
      }
    });
  }

  openUpdateDialog(paiement: Paiement): void {
    const dialogRef = this.dialog.open(PaiementDetailsPopupComponent, {
      data: paiement
    });

    dialogRef.afterClosed().subscribe(updatedPaiement => {
      if (updatedPaiement) {
        // Perform update operation here
        this.paiementService.updatePaiement(updatedPaiement, updatedPaiement.id)
          .subscribe(response => {
            // Handle response or any further action
            console.log('Payment updated:', response);
            this.getPaiements();
          });
      }
    });
  }

  openAddPaiementDialog(): void {
    // Initialize a new instance of Paiement and assign it to the dialog data
    const newPaiement: Paiement = new Paiement();
    newPaiement.adherent = new Adherent(); // Ensure adherent is initialized

    const dialogRef = this.dialog.open(AddPaiementPopupComponent, {
      data: newPaiement // Pass the initialized Paiement object to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle dialog result if needed
        this.getPaiements();
      }
    });
  }

  openPaymentHistoryPopup(adherentId: number): void {
    this.paiementService.getPaiementHistory(adherentId).subscribe((paiementHistory) => {
      this.dialog.open(PaiementHistoryPopupComponent, {
        data: paiementHistory,
      });
    });
  }

  openMembreDetailPopup(adherentId: number): void {
    this.paiementService.getAdherentById(adherentId).subscribe((adherent) => {
      this.dialog.open(detailMembrePopupComponent, {
        data: adherent,
      });
    });
  }
}

@Component({
  selector: 'app-paiement-details-popup',
  templateUrl: './paiementDetails.component.html',
})
export class PaiementDetailsPopupComponent {
  typeAbonnements: string[] = Object.values(TypeAbonnement)
    .filter(value => typeof value === 'string')
    .map(value => String(value));
  constructor(public dialogRef: MatDialogRef<PaiementDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public paiement: Paiement) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  templateUrl: './addPaiement.component.html',
})
export class AddPaiementPopupComponent {
  paiement: Paiement = new Paiement(); // Initialize an empty Paiement object
  members: Adherent[] = [];
  typeAbonnements: TypeAbonnement[] = [TypeAbonnement.Annuel, TypeAbonnement.Mensuel, TypeAbonnement.Trimestriel];

  constructor(
    public dialogRef: MatDialogRef<AddPaiementPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject any data if needed
    private paiementService: PaiementService
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getTypeAbonnementName(type: TypeAbonnement): string {
    return TypeAbonnement[type];
  }


  getMembers(): void {
    this.paiementService.getMembers().subscribe(members => {
      this.members = members;
    });
  }

  onMemberSelectionChange(): void {
    if (this.paiement.adherent) {
      this.paiement.dateDebut = this.paiement.adherent.paiementDate;
      this.paiement.datePaiement = new Date();
    }
  }

  getDateFin(): void {
    if (this.paiement.dateDebut && this.paiement.typeAbonnement !== undefined) {
      // Clone the dateDebut to avoid modifying it directly
      const dateFin = new Date(this.paiement.dateDebut);

      // Set the date based on subscription type
      switch (this.paiement.typeAbonnement) {
        case TypeAbonnement.Mensuel:
          dateFin.setMonth(dateFin.getMonth() + 1);
          break;
        case TypeAbonnement.Trimestriel:
          dateFin.setMonth(dateFin.getMonth() + 3);
          break;
        case TypeAbonnement.Annuel:
          dateFin.setFullYear(dateFin.getFullYear() + 1);
          break;
        default:
          console.error('Invalid subscription type');
          return;
      }

      // Ensure day does not exceed the last day of the month
      dateFin.setDate(Math.min(dateFin.getDate(), new Date(dateFin.getFullYear(), dateFin.getMonth() + 1, 0).getDate()));

      this.paiement.dateFin = dateFin;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.paiement.adherent) {
      this.paiementService.addPaiement(this.paiement, this.paiement.adherent.id)
        .subscribe(response => {
          console.log('Payment added:', response);
          this.dialogRef.close(response); // Close dialog with response if needed
        }, error => {
          console.error('Error adding payment:', error);
          // Handle error if necessary
        });
    } else {
      console.error('Paiement adherent is undefined');
      // Handle case where adherent is undefined
    }
  }
}


@Component({
  templateUrl: './paiementHistory.component.html',
  selector: 'app-paiement-history-popup',
})
export class PaiementHistoryPopupComponent {
  constructor(public dialogRef: MatDialogRef<PaiementDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public paiementHistory: PaiementHistory[]) { }

  close(): void {
    this.dialogRef.close();
  }

  paiementhistoryColumns: string[] = [
    'dateDebut',
    'dateFin',
    'datePaiement',
    'retardPaiement',
    'montant',
    'reste',
  ];
}

@Component({
  templateUrl: './detailMembre.component.html',
  selector: 'app-detail-membre-popup',
})
export class detailMembrePopupComponent {
  constructor(public dialogRef: MatDialogRef<detailMembrePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public adherent: Adherent) { }

  close(): void {
    this.dialogRef.close();
  }

  detailMemberColumns: string[] = [
    'nom',
    'email',
    'telephone',
    'statut',
  ];
}

@Component({
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Close the dialog with false value
  }

  onConfirmClick(): void {
    this.dialogRef.close(true); // Close the dialog with true value
  }
}

