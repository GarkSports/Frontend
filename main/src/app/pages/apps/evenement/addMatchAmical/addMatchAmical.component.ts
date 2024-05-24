import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
    FormControl,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { EvenementService } from 'src/app/services/evenement.service';
import { Equipe } from 'src/models/equipe.model';
import { Evenement } from 'src/models/evenement.model'; // Import Evenement model
import { MatchAmicalRequest } from 'src/models/dto/MatchAmicalRequest.model';
import { Router } from '@angular/router';
import { TypeRepetition } from 'src/models/enums/typeRepetition.model';

@Component({
    selector: 'add-matchamical',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './addMatchAmical.component.html',
})
export class AddMatchAmicalComponent {
    equipeList: Equipe[] = [];
    selectedEquipeId: number; // Changed from selectedEquipes: number[] to selectedEquipeId: number
    matchAmicalForm: FormGroup;
    typeRepetitions: string[] = Object.values(TypeRepetition).filter(value => typeof value === 'string').map(value => String(value));
    selectedTypeRepetition: string;

    constructor(
        private formBuilder: FormBuilder,
        private eventService: EvenementService,
        private router: Router
    ) {
        this.matchAmicalForm = this.formBuilder.group({
            nomEvent: ['', Validators.required],
            lieu: ['', Validators.required],
            date: ['', Validators.required],
            description: ['', Validators.required],
            horaire: [''], // Add the 'horaire' form control here
            repetition: [false, Validators.required],
            typeRepetition: [TypeRepetition.SEMAINE, Validators.required],
            nbRepetition: [''],
        });
        // Subscribe to repetition control value changes to toggle typeRepetition and nbRepetition validation
        this.matchAmicalForm.get('repetition')!.valueChanges.subscribe((repetition) => {
            const typeRepetitionControl = this.matchAmicalForm.get('typeRepetition')!;
            const nbRepetitionControl = this.matchAmicalForm.get('nbRepetition')!; // Add this line
            if (repetition) {
                typeRepetitionControl.setValidators(Validators.required);
                nbRepetitionControl.setValidators(Validators.required); // Add this line
            } else {
                typeRepetitionControl.clearValidators();
                nbRepetitionControl.clearValidators(); // Add this line
            }
            typeRepetitionControl.updateValueAndValidity();
            nbRepetitionControl.updateValueAndValidity(); // Add this line
        });
    }

    ngOnInit(): void {
        this.getEquipes();
    }

    getEquipes(): void {
        this.eventService.getEquipes().subscribe(equipes => {
            this.equipeList = equipes;
        });
    }

    onSubmit(): void {
        if (this.selectedEquipeId) { // Changed condition to check for selectedEquipeId
            // Form is valid and equipe is selected
            const formData = this.matchAmicalForm.value;
            const matchAmicalRequest = new MatchAmicalRequest(
                new Evenement(), // Changed to use an empty Evenement constructor
                this.selectedEquipeId,
                formData.horaire
            );

            // Set the properties of the Evenement object
            matchAmicalRequest.evenement.nomEvent = formData.nomEvent;
            matchAmicalRequest.evenement.lieu = formData.lieu;
            matchAmicalRequest.evenement.date = formData.date;
            matchAmicalRequest.evenement.description = formData.description;
            matchAmicalRequest.evenement.repetition = formData.repetition;
            matchAmicalRequest.evenement.typeRepetition = formData.typeRepetition;
            matchAmicalRequest.evenement.nbRepetition = formData.nbRepetition;


            console.log('Form Data:', matchAmicalRequest); // Log the form data

            this.eventService.addMatchAmical(matchAmicalRequest).subscribe(
                (response) => {
                    console.log('Friendly match added successfully:', response);
                    // Reset the form after successful submission
                    this.matchAmicalForm.reset();
                    this.router.navigate(['/apps/listevenement']);

                },
                (error) => {
                    console.error('Error adding friendly match:', error);
                    // Handle error
                }
            );
        } else {
            console.error('No equipe selected');
        }
    }

    onEquipeSelect(equipeId: number): void { // Changed parameters of onEquipeSelect function
        this.selectedEquipeId = equipeId; // Changed selectedEquipes to selectedEquipeId
    }
}
