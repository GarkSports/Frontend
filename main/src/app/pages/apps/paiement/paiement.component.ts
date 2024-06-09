import { Component, Inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';

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
  selectedSortingOption: string;
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' }
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private paiementService: PaiementService, private router: Router) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applySorting() {
    if (this.selectedSortingOption === 'asc') {
      this.dataSource.data.sort((a, b) => {
        const memberA = `${a.adherent?.firstname} ${a.adherent?.lastname}`.toLowerCase();
        const memberB = `${b.adherent?.firstname} ${b.adherent?.lastname}`.toLowerCase();
        return memberA.localeCompare(memberB);
      });
    } else if (this.selectedSortingOption === 'desc') {
      this.dataSource.data.sort((a, b) => {
        const memberA = `${a.adherent?.firstname} ${a.adherent?.lastname}`.toLowerCase();
        const memberB = `${b.adherent?.firstname} ${b.adherent?.lastname}`.toLowerCase();
        return memberB.localeCompare(memberA);
      });
    }
    // After sorting, reassign the sorted data to the dataSource
    this.dataSource = new MatTableDataSource<Paiement>(this.dataSource.data);
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
    this.selectedSortingOption = '';
    this.getPaiements();

    // Apply filters again to refresh the data
    this.applyFilter('');
  }

  formatEnumValue(value: string): string {
    return value.replace(/_/g, ' ');
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
        // Handle dialog result if needed
        this.getPaiements();
      }
    });
  }

  openAddPaiementDialog(): void {
    // Initialize a new instance of Paiement and assign it to the dialog data
    const newPaiement: Paiement = new Paiement();
    newPaiement.adherent = new Adherent(); // Ensure adherent is initialized

    this.router.navigate(['/apps/addPaiement']);
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
    @Inject(MAT_DIALOG_DATA) public paiement: Paiement, private paiementService: PaiementService) { }

  isFormValid(): boolean {
    // Vérifier si tous les champs obligatoires sont remplis et s'ils ont des valeurs valides
    return (this.paiement.montant !== undefined && this.paiement.montant >= 0 && this.paiement.montant !== null) && (this.paiement.reste === undefined || this.paiement.reste >= 0) && this.paiement.typeAbonnement !== undefined && (this.paiement.dateDebut !== undefined && this.paiement.dateDebut !== null) && (this.paiement.dateFin !== undefined && this.paiement.dateFin !== null) && (this.paiement.datePaiement !== undefined && this.paiement.datePaiement !== null);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
  onUpdateClick(): void {
    if (this.paiement) {
      const updatedPaiementData = {
        typeAbonnement: this.paiement.typeAbonnement,
        dateDebut: this.paiement.dateDebut,
        dateFin: this.paiement.dateFin,
        datePaiement: this.paiement.datePaiement,
        montant: this.paiement.montant,
        reste: this.paiement.reste,
        remarque: this.paiement.remarque,
        retardPaiement: this.paiement.retardPaiement
      };
      const updatedPaiement: Partial<Paiement> = { ...updatedPaiementData };
      this.paiementService.updatePaiement(updatedPaiement as Paiement, this.paiement.id)
        .subscribe(
          response => {
            console.log('Payment updated:', response);
            this.dialogRef.close(response); // Close dialog with response
          },
          error => {
            console.error('Error updating payment:', error);
            // Handle error if necessary
          }
        );
    } else {
      console.error('Paiement is undefined');
      // Handle case where paiement is undefined
    }
  }
}


@Component({
  selector: 'app-add-paiement',
  templateUrl: './addPaiement.component.html',
})
export class AddPaiementPopupComponent implements OnInit {
  paiement: Paiement = new Paiement();
  members: Adherent[] = [];
  typeAbonnements: TypeAbonnement[] = [TypeAbonnement.Annuel, TypeAbonnement.Mensuel, TypeAbonnement.Trimestriel];

  constructor(private router: Router, private paiementService: PaiementService) { }

  ngOnInit(): void {
    this.getMembers();
  }

  numStep=1;
  changeStep(num: number): void {
    this.numStep = num;
  }
  isFormValid(): boolean {
    return (
      (this.paiement.montant !== undefined && this.paiement.montant >= 0 && this.paiement.montant !== null) &&
      (this.paiement.reste === undefined || this.paiement.reste >= 0) &&
      this.paiement.typeAbonnement !== undefined &&
      this.paiement.adherent !== undefined &&
      (this.paiement.dateDebut !== undefined && this.paiement.dateDebut !== null) &&
      (this.paiement.dateFin !== undefined && this.paiement.dateFin !== null) &&
      (this.paiement.datePaiement !== undefined && this.paiement.datePaiement !== null)
    );
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
      const dateFin = new Date(this.paiement.dateDebut);
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
      dateFin.setDate(Math.min(dateFin.getDate(), new Date(dateFin.getFullYear(), dateFin.getMonth() + 1, 0).getDate()));
      this.paiement.dateFin = dateFin;
    }
  }

  onCancelClick(): void {
    // Handle cancellation logic, such as navigating back to the previous page
    this.router.navigate(['/apps/paiement']);
  }

  onSaveClick(): void {
    if (this.paiement.adherent) {
      const paiementData = {
        typeAbonnement: this.paiement.typeAbonnement,
        dateDebut: this.paiement.dateDebut,
        dateFin: this.paiement.dateFin,
        datePaiement: this.paiement.datePaiement,
        montant: this.paiement.montant,
        reste: this.paiement.reste,
        remarque: this.paiement.remarque,
        retardPaiement: this.paiement.retardPaiement
      };
      const newPaiement: Partial<Paiement> = { ...paiementData };
      this.paiementService.addPaiement(newPaiement as Paiement, this.paiement.adherent.id)
        .subscribe(response => {
          console.log('Payment added:', response);
          // Handle success, such as showing a success message or navigating to a different page
          this.router.navigate(['/apps/paiement']);
        }, error => {
          console.error('Error adding payment:', error);
          // Handle error, such as showing an error message or allowing the user to retry
        });
    } else {
      console.error('Paiement adherent is undefined');
      // Handle case where adherent is undefined, such as showing an error message
    }
  }
}


@Component({
  templateUrl: './paiementHistory.component.html',
  selector: 'app-paiement-history-popup',
})
export class PaiementHistoryPopupComponent {
  constructor(public dialogRef: MatDialogRef<PaiementDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public paiementHistory: PaiementHistory[], private paiementService: PaiementService) { }

  close(): void {
    this.dialogRef.close();
  }

  paiementhistoryColumns: string[] = [
    'dateDebut',
    'dateFin',
    'datePaiement',
    'montant',
    'reste',
    'action',
  ];
  reloadPaiementHistory(): void {
    // Assuming you have the adherent ID accessible somehow, e.g., passed via MAT_DIALOG_DATA
    const adherentId = this.paiementHistory[0]?.adherent?.id;
    if (adherentId) {
      this.paiementService.getPaiementHistory(adherentId).subscribe({
        next: (histories) => {
          this.paiementHistory = histories;
        },
        error: (error) => {
          console.error('Error loading paiement histories:', error);
        }
      });
    }
  }

  deletePaiementHistory(idPaiementHistory: number): void {
    this.paiementService.deletePaiementHistory(idPaiementHistory).subscribe({
      next: () => {
        // Handle successful deletion, e.g., show a confirmation message or refresh data
        this.reloadPaiementHistory();  // Reload the list after deletion
      },
      error: (error) => {
        // Handle error
        console.error('Error deleting paiement history:', error);
      }
    });
  }


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
