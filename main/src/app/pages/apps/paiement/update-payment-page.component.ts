import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paiement } from 'src/models/paiement.model';
import { PaiementService } from 'src/app/services/paiement.service';
import { TypeAbonnement } from 'src/models/enums/typeAbonnement.model';
import { PaiementHistoryPopupComponent } from "./paiement.component";
import { PaiementHistory } from "../../../../models/paiementHistory.model";

@Component({
  selector: 'app-update-payment-page',
  templateUrl: './update-payment-page.component.html',
})
export class UpdatePaymentPageComponent implements OnInit {
  paiement: Paiement;
  typeAbonnements: string[] = Object.values(TypeAbonnement).filter(value => typeof value === 'string').map(value => String(value));

  constructor(private route: ActivatedRoute, private paiementService: PaiementService, private router: Router) { }

  ngOnInit(): void {
    this.getPaiement();
  }
  historic: PaiementHistory[] = []
  numStep = 1;
  changeStep(num: number): void {
    this.numStep = num;
    if (this.numStep == 2 && this.paiement.adherent != null) {

      this.paiementService.getPaiementHistory(this.paiement.adherent.id).subscribe((paiementHistory) => {
        this.historic = paiementHistory;
        console.log(paiementHistory)
      });
    }
  }
  getPaiement(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = parseInt(idString, 10);
      this.paiementService.getPaiementById(id).subscribe((data) => {
        this.paiement = data;
      });
    } else {
      console.error('ID parameter is null');
    }
  }

  isFormValid(): boolean {
    return this.paiement.dateDebut && this.paiement.dateFin && this.paiement.montant !== null;
  }

  getTodayDateString(val: Date | null = null) {
    let date = val ? new Date(val) : new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    let day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onMontantChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = parseFloat(inputElement.value);
    if (newValue > 0) {
      this.paiement.datePaiement = this.getTodayDateString(new Date());
    }else{
      this.paiement.datePaiement = null;
    }
  }

  getDateFin(event: any): void {
    const dateFin = new Date(this.paiement.dateDebut);

    switch (event ? event.target.value : this.paiement.typeAbonnement.valueOf()) {
      case 'Mensuel':
        this.paiement.typeAbonnement = TypeAbonnement.Mensuel
        dateFin.setMonth(dateFin.getMonth() + 1);

        break;
      case 'Trimestriel':
        this.paiement.typeAbonnement = TypeAbonnement.Trimestriel
        dateFin.setMonth(dateFin.getMonth() + 3);
        break;
      case 'Annuel':

        this.paiement.typeAbonnement = TypeAbonnement.Annuel
        dateFin.setFullYear(dateFin.getFullYear() + 1);
        break;
      default:
        console.error('Invalid subscription type');
        return;
    }
    dateFin.setDate(Math.min(dateFin.getDate(), new Date(dateFin.getFullYear(), dateFin.getMonth() + 1, 0).getDate()));
    this.paiement.dateFin = this.getTodayDateString(dateFin);
    console.log(this.paiement.dateFin)

  }

  onCancel(): void {
    // Navigate back to the previous page
    window.history.back();
  }

  onUpdate(paiement: Paiement): void {
    const updatedPaiementData = {
      typeAbonnement: paiement.typeAbonnement,
      dateDebut: paiement.dateDebut,
      dateFin: paiement.dateFin,
      datePaiement: paiement.datePaiement,
      montant: paiement.montant,
      reste: paiement.reste,
      remarque: paiement.remarque,
      retardPaiement: paiement.retardPaiement
    };
    const updatedPaiement: Partial<Paiement> = { ...updatedPaiementData };
    this.paiementService.updatePaiement(updatedPaiement as Paiement, paiement.id).subscribe(
      () => {
        // Redirect back to the payment details page after updating
        // You can also navigate to any other page as needed
        // Replace '/paiement-details' with the appropriate route
        this.router.navigate(['/apps/paiement']);
      },
      (error) => {
        console.error('Error updating payment:', error);
        // Handle error if necessary
      }
    );
  }
}
