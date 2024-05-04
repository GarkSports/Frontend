import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
    selector: 'add-competition',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule],
    templateUrl: './addCompetition.component.html',
})
export class AddCompetitionComponent {
    competitionForm: FormGroup;
    constructor(
        private _formBuilder: FormBuilder,
        private evenementService: EvenementService
    ) {
        this.competitionForm = this._formBuilder.group({
            nom: ['', Validators.required],
            lieu: ['', Validators.required],
            date: ['', Validators.required],
            horraire: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.competitionForm.valid) {
            const formData = this.competitionForm.value;
            // Prepare the data to send to the backend
            const evenementData = {
                nomEvent: formData.nom,
                lieu: formData.lieu,
                date: formData.date,
                heure: formData.horraire,
                description: formData.description,
            };
            // Call the service method to add the competition
            this.evenementService.addCompetition(evenementData).subscribe(
                (response) => {
                    console.log('Competition added successfully:', response);
                    // Reset the form after successful submission
                    this.competitionForm.reset();
                },
                (error) => {
                    console.error('Error adding competition:', error);
                    // Handle error
                }
            );
        } else {
            // Form is invalid, do something like showing error messages
        }
    }
}
