import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { EvenementService } from 'src/app/services/evenement.service';
import { Equipe } from 'src/models/equipe.model';
import { Evenement } from 'src/models/evenement.model'; // Import Evenement model
import { MatchAmicalRequest } from 'src/models/dto/MatchAmicalRequest.model';
import { Router } from '@angular/router';
import { TypeRepetition } from 'src/models/enums/typeRepetition.model';
import { EquipeHorraireDTO } from 'src/models/dto/equipeHorraireDTO .model';

@Component({
    selector: 'add-matchamical',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './addMatchAmical.component.html',
})
export class AddMatchAmicalComponent {
    equipeList: Equipe[] = [];
    selectedEquipeIds: number[] = []; // Changed from selectedEquipeId: number to selectedEquipeIds: number[]
    matchAmicalForm: FormGroup;
    typeRepetitions: string[] = Object.values(TypeRepetition).filter(value => typeof value === 'string').map(value => String(value));
    selectedTypeRepetition: string;
    step1: boolean = true;

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
            repetition: [false, Validators.required],
            typeRepetition: [TypeRepetition.SEMAINE, Validators.required],
            nbRepetition: [''],
        });
        // Subscribe to repetition control value changes to toggle typeRepetition and nbRepetition validation
        this.matchAmicalForm.get('repetition')!.valueChanges.subscribe((repetition) => {
            const typeRepetitionControl = this.matchAmicalForm.get('typeRepetition')!;
            const nbRepetitionControl = this.matchAmicalForm.get('nbRepetition')!;
            if (repetition) {
                typeRepetitionControl.setValidators(Validators.required);
                nbRepetitionControl.setValidators(Validators.required);
            } else {
                typeRepetitionControl.clearValidators();
                nbRepetitionControl.clearValidators();
            }
            typeRepetitionControl.updateValueAndValidity();
            nbRepetitionControl.updateValueAndValidity();
        });
    }

    nextStep(): void {
        this.step1 = false;
    }

    ngOnInit(): void {
        this.getEquipes();
    }

    getEquipes(): void {
        this.eventService.getEquipes().subscribe(equipes => {
            this.equipeList = equipes;

            // Add form controls for each equipe ID and select them by default
            equipes.forEach(equipe => {
                this.matchAmicalForm.addControl('horaire' + equipe.id, this.formBuilder.control(''));
                this.selectedEquipeIds.push(equipe.id); // Select all equipe IDs by default
            });
        });
    }



    onSubmit(): void {
        // Initialize an array to hold the selected equipes with their schedules
        const equipesHorraires: EquipeHorraireDTO[] = [];

        // Iterate over selectedEquipeIds to collect selected equipes and their schedules
        this.selectedEquipeIds.forEach(equipeId => {
            const horaireControl = this.matchAmicalForm.get('horaire' + equipeId);
            if (horaireControl) { // Check if the control exists
                equipesHorraires.push({
                    equipeId: equipeId,
                    horraire: horaireControl.value
                });
            }
        });

        // Form is valid and equipes are selected
        const formData = this.matchAmicalForm.value;
        const matchAmicalRequest = new MatchAmicalRequest(
            new Evenement(), // Changed to use an empty Evenement constructor
            equipesHorraires // Pass the array of selected equipes and their schedules
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
    }


    onEquipeSelect(equipeId: number): void {
        // Toggle selected equipe ID
        if (this.selectedEquipeIds.includes(equipeId)) {
            this.selectedEquipeIds = this.selectedEquipeIds.filter(id => id !== equipeId);
        } else {
            this.selectedEquipeIds.push(equipeId);
        }
    }
}
