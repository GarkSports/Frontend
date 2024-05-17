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
import { Adherent } from 'src/models/adherent.model';
import { Evenement } from 'src/models/evenement.model';
import { TestRequest } from 'src/models/dto/TestRequest.model';
import { Router } from '@angular/router';

@Component({
    selector: 'add-test',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './addTest.component.html',
})
export class AddTestComponent {
    evenementForm: FormGroup;
    equipeList: Equipe[] = [];
    memberList: Adherent[] = [];
    evenement: Evenement = new Evenement();
    selectedEquipe: number[] = [];
    selectedMembers: number[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private eventService: EvenementService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.getEquipes();
        this.getMembers();
    }

    initializeForm(): void {
        this.evenementForm = this.formBuilder.group({
            selectedOption: ['equipe'],
            nom: ['', Validators.required],
            date: ['', Validators.required],
            horraire: ['', Validators.required],
            equipe: [''],
            membres: ['']
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
        });
    }

    onSubmit(): void {
        if (this.evenementForm.valid) {
            const formData = this.evenementForm.value;
            this.evenement.nomEvent = formData.nom;
            this.evenement.date = formData.date;
            this.evenement.heure = formData.horraire;

            let request: TestRequest;
            if (formData.selectedOption === 'equipe') {
                request = new TestRequest(this.evenement, formData.equipe, []);
            } else {
                request = new TestRequest(this.evenement, null, formData.membres);
            }
            console.log('Request:', request);

            this.eventService.addTest(request).subscribe(
                (response) => {
                    console.log('Evenement test added successfully:', response);
                    this.evenementForm.reset();
                    this.router.navigate(['/apps/listevenement']);
                },
                (error) => {
                    console.error('Error adding evenement test:', error);
                }
            );
        } else {
            // Form is invalid, do something like showing error messages
        }
    }
}
