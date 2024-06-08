import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComptabiliteService } from 'src/app/services/comptabilite.service';
import { Benefices, Depenses } from 'src/models/comptabilite.model';

@Component({
  selector: 'app-add-benefice-depense',
  templateUrl: './add-benefice-depense.component.html',
  styleUrl: './add-benefice-depense.component.scss'
})
export class AddBeneficeDepenseComponent {
  addtype: any;
  
  evenementForm: FormGroup;


  constructor(public router: Router,
    activatedRouter: ActivatedRoute,
    private ComptabiliteService: ComptabiliteService,
    private fb: FormBuilder
    ) {

    this.addtype = activatedRouter.snapshot.paramMap.get('type');

    this.evenementForm = this.fb.group({
      type: ['', Validators.required],
      etat: ['', Validators.required],
      date: ['', Validators.required],
      prixunite: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      
    });

    if (this.addtype === 'depenses') {
      this.evenementForm.addControl('beneficiaire', this.fb.control('', Validators.required));
    }
  }
  
  add(): void {
  if (this.evenementForm.invalid) {
    console.log("  if (this.evenementForm.invalid) ")
    this.evenementForm.markAllAsTouched();
    return;
  }
  console.log("  if (this.evenementForm.invalid) ")


  if (this.addtype === 'depenses') {
    const formValues = this.evenementForm.value as Depenses;
    console.log("this is add depenses",formValues)

    this.ComptabiliteService.saveDepense(formValues).subscribe(
      (response) => {
        console.log('Depense added successfully', response);
        this.router.navigate(['apps/comptabilite']); // Replace with your desired route
      },
      (error) => {
        console.error('Error adding depense', error);
      }
    );
  } else if (this.addtype === 'benefices') {
    const formValues = this.evenementForm.value as Benefices;
    console.log("this is add benefices",formValues)

    this.ComptabiliteService.saveBenefice(formValues).subscribe(
      (response) => {
        console.log('Benefice added successfully', response);
        this.router.navigate(['apps/comptabilite']); // Replace with your desired route
      },
      (error) => {
        console.error('Error adding benefice', error);
      }
    );
  } else {
    console.error('Unknown type:', this.addtype);
  }
}

  


}
