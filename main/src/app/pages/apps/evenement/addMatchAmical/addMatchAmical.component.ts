import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { EvenementService } from 'src/app/services/evenement.service';
import { Equipe } from 'src/models/equipe.model';

@Component({
    selector: 'add-matchamical',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './addMatchAmical.component.html',
})
export class AddMatchAmicalComponent {
    equipeList: Equipe[] = [];
    selectedEquipes: number[] = [];
    matchAmicalForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private eventService: EvenementService
    ) {
        this.matchAmicalForm = this.formBuilder.group({
            nomEvent: ['', Validators.required],
            lieu: ['', Validators.required],
            date: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.getEquipes();
    }

    getEquipes(): void {
        this.eventService.getEquipes().subscribe(equipes => {
            this.equipeList = equipes;
            this.createHoraireControls();
        });
    }

    createHoraireControls(): void {
        // Remove previous horaire controls
        Object.keys(this.matchAmicalForm.controls).forEach(key => {
            if (key.startsWith('horaire')) {
                this.matchAmicalForm.removeControl(key);
            }
        });
    
        // Add new horaire controls for each equipe
        this.equipeList.forEach(equipe => {
            this.matchAmicalForm.addControl('horaire' + equipe.id, this.formBuilder.control('', Validators.required));
        });
    }
    

    onSubmit(): void {
        if (this.selectedEquipes.length > 0) {
            // Form is valid and at least one equipe is selected
            const formData = this.matchAmicalForm.value;
            const selectedEquipesHoraire = this.selectedEquipes.map(equipeId => ({
                equipeId,
                horaire: formData['horaire' + equipeId]
            }));
    
            const matchAmicalRequest = {
                evenement: formData,
                equipesHoraire: selectedEquipesHoraire
            };
    
            console.log('Form Data:', matchAmicalRequest); // Log the form data
    
            this.eventService.addMatchAmical(matchAmicalRequest).subscribe(
                (response) => {
                    console.log('Friendly match added successfully:', response);
                    // Reset the form after successful submission
                    this.matchAmicalForm.reset();
                },
                (error) => {
                    console.error('Error adding friendly match:', error);
                    // Handle error
                }
            );
        } else {
            console.error('Form is invalid or no equipe selected');
        }
    }
    
    

    onEquipeSelect(equipeId: number, isChecked: boolean): void {
        if (isChecked) {
            this.selectedEquipes.push(equipeId);
        } else {
            const index = this.selectedEquipes.indexOf(equipeId);
            if (index !== -1) {
                this.selectedEquipes.splice(index, 1);
            }
        }
    }
}

