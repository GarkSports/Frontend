import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComptabiliteService } from 'src/app/services/comptabilite.service';
import { Benefices, Depenses } from 'src/models/comptabilite.model';

@Component({
  selector: 'app-update-benefice-depense',
  templateUrl: './update-benefice-depense.component.html',
})
export class UpdateBeneficeDepenseComponent implements OnInit {
  addtype: string | null = null;
  getid: string | null = null;
  evenementForm: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private comptabiliteService: ComptabiliteService,
    private fb: FormBuilder
  ) {
    this.evenementForm = this.fb.group({
      type: ['', Validators.required],
      etat: ['', Validators.required],
      date: ['', Validators.required],
      prixunite: ['', [Validators.required, Validators.min(0)]],
      quantite: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.addtype = params.get('type');
      this.getid = params.get('id');
      console.log('Type:', this.addtype);
      console.log('ID:', this.getid);
      this.loadInitialValues();
    });

    if (this.addtype === 'depenses') {
      this.evenementForm.addControl('beneficiaire', this.fb.control('', Validators.required));
    }
  }

  loadInitialValues(): void {
    if (this.addtype === 'benefices' && this.getid) {
      const id = parseInt(this.getid, 10);
      this.comptabiliteService.getBeneficeById(id).subscribe(
        data => {
          this.evenementForm.patchValue({
            type: data.type,
            etat: data.etat,
            date: data.date,
            prixunite: data.prixUnite,
            quantite: data.quantite,
          });
        },
        error => {
          console.error('Error getBeneficeById', error);
        }
      );
    } else if (this.addtype === 'depenses' && this.getid) {
      const id = parseInt(this.getid, 10);
      this.comptabiliteService.getDepenseById(id).subscribe(
        data => {
          this.evenementForm.patchValue({
            type: data.type,
            etat: data.etat,
            date: data.date,
            prixunite: data.prixUnite,
            quantite: data.quantite,
            beneficiaire: data.beneficiaire,
          });
        },
        error => {
          console.error('Error getDepenseById', error);
        }
      );
    }
  }

  update(): void {
    if (this.evenementForm.invalid) {
      this.evenementForm.markAllAsTouched();
      return;
    }

    if (this.addtype === 'depenses' && this.getid) {
      const formValues = this.evenementForm.value as Depenses;
      const id = parseInt(this.getid, 10);
      this.comptabiliteService.updateDepense(id,formValues).subscribe(
        response => {
          console.log('Depense updated successfully', response);
          this.router.navigate(['apps/comptabilite']); // Replace with your desired route
        },
        error => {
          console.error('Error update depense', error);
        }
      );
    } else if (this.addtype === 'benefices' && this.getid) {
      const formValues = this.evenementForm.value as Benefices;
      const id = parseInt(this.getid, 10);

      this.comptabiliteService.updateBenefice(id,formValues).subscribe(
        response => {
          console.log('Benefice update successfully', response);
          this.router.navigate(['apps/comptabilite']); // Replace with your desired route
        },
        error => {
          console.error('Error update benefice', error);
        }
      );
    } else {
      console.error('Unknown type:', this.addtype);
    }
  }


}
