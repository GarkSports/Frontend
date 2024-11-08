import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { EvenementService } from 'src/app/services/evenement.service';
import { Adherent } from 'src/models/adherent.model';
import { CompetitionRequest } from 'src/models/dto/CompetitonRequest.model';
import { TypeRepetition } from 'src/models/enums/typeRepetition.model';
import { Equipe } from 'src/models/equipe.model';
import { Evenement } from 'src/models/evenement.model';

@Component({
    selector: 'add-competition',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './addCompetition.component.html',
})
export class AddCompetitionComponent {
    evenementForm: FormGroup;
    equipeList: Equipe[] = [];
    memberList: Adherent[] = [];
    evenement: Evenement = new Evenement();
    selectedOption: string = 'equipe';
    selectedEquipe: number; // Define selectedEquipe property here
    selectedEquipe2: Equipe;
    selectedMembers: number[] = []; // Define selectedMembers property here
    typeRepetitions: string[] = Object.values(TypeRepetition).filter(value => typeof value === 'string').map(value => String(value));
    selectedTypeRepetition: string;

    constructor(
        private formBuilder: FormBuilder,
        private eventService: EvenementService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.getEquipes();
        this.getMembers();
    }

  setEquipe2(event:any){
    this.selectedEquipe2 = this.equipeList.filter(equipe => equipe.id == event.target.value)[0];
  }
    initializeForm(): void {
        this.evenementForm = this.formBuilder.group({
            nom: ['', Validators.required],
            lieu: ['', Validators.required],
            date: ['', Validators.required],
            horraire: ['', Validators.required],
            description: ['', Validators.required],
            repetition: [false, Validators.required],
            typeRepetition: [TypeRepetition.SEMAINE, Validators.required],
            nbRepetition: ['0'],
            equipe: [''],
            membres: ['']
        });

        // Subscribe to repetition control value changes to toggle typeRepetition and nbRepetition validation
        this.evenementForm.get('repetition')!.valueChanges.subscribe((repetition) => {
            const typeRepetitionControl = this.evenementForm.get('typeRepetition')!;
            const nbRepetitionControl = this.evenementForm.get('nbRepetition')!; // Add this line
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


    getEquipes(): void {
        this.eventService.getEquipes().subscribe(equipes => {
            this.equipeList = equipes;
        });
    }

    getMembers(): void {
        this.eventService.getMembers().subscribe(members => {
            this.memberList = members;
    
            // Initialize selectedMembers array with all member IDs
            this.selectedMembers = this.memberList.map(member => member.id);
        });
    }
    

    changeOption(option: string): void {
        this.selectedOption = option;
    }

    getTypeRepetitionFromString(value: string): TypeRepetition {
        return TypeRepetition[value as keyof typeof TypeRepetition];
    }


    onSubmit(): void {
        if (this.evenementForm.valid) {
            const formData = this.evenementForm.value;
            this.evenement.nomEvent = formData.nom;
            this.evenement.lieu = formData.lieu;
            this.evenement.date = formData.date;
            this.evenement.heure = formData.horraire;
            this.evenement.description = formData.description;
            this.evenement.repetition = formData.repetition;
            this.evenement.typeRepetition = this.getTypeRepetitionFromString(formData.typeRepetition);
            this.evenement.nbRepetition = formData.nbRepetition;


            let request: CompetitionRequest;
            if (this.selectedOption === 'equipe') {
                request = new CompetitionRequest(this.evenement, this.selectedEquipe, []);
            } else {
                request = new CompetitionRequest(this.evenement, null, this.selectedMembers);
            }

            this.eventService.addCompetition(request).subscribe(
                (response) => {
                    console.log('Evenement personnalisé added successfully:', response);
                    // Reset the form after successful submission
                    this.evenementForm.reset();
                    this.router.navigate(['/apps/listevenement']);
                },
                (error) => {
                    console.error('Error adding evenement personnalisé:', error);
                    // Handle error
                }
            );
        } else {
            // Form is invalid, do something like showing error messages
        }
    }
}
