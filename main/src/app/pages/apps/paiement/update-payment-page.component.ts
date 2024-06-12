import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paiement } from 'src/models/paiement.model';
import { PaiementService } from 'src/app/services/paiement.service';
import { TypeAbonnement } from 'src/models/enums/typeAbonnement.model';
import {PaiementHistoryPopupComponent} from "./paiement.component";
import {PaiementHistory} from "../../../../models/paiementHistory.model";

@Component({
  selector: 'app-update-payment-page',
  templateUrl: './update-payment-page.component.html',
})
export class UpdatePaymentPageComponent implements OnInit {
  paiement: Paiement;
  typeAbonnements: string[] = Object.values(TypeAbonnement).filter(value => typeof value === 'string').map(value => String(value));

  constructor(private route: ActivatedRoute, private paiementService: PaiementService, private router: Router) {}

  ngOnInit(): void {
    this.getPaiement();
  }
  historic :PaiementHistory[]= []
  numStep=1;
  changeStep(num: number): void {
    this.numStep = num;
    if( this.numStep == 2 && this.paiement.adherent !=null) {

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
