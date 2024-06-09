import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MaterialModule} from 'src/app/material.module';
import {CommonModule} from '@angular/common';
import {EvenementService} from 'src/app/services/evenement.service';
import {Equipe} from 'src/models/equipe.model';
import {Adherent} from 'src/models/adherent.model';
import {PersonnaliseRequest} from 'src/models/dto/PersonnaliseRequest.model';
import {Evenement} from 'src/models/evenement.model';
import {Router} from '@angular/router';
import {TypeRepetition} from 'src/models/enums/typeRepetition.model';

@Component({
  selector: 'add-personnalise',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './addPersonnalise.component.html',
})
export class AddPersonnaliseComponent {
  evenementForm: FormGroup;
  equipeList: Equipe[] = [];
  memberList: Adherent[] = [];
  selectedOption: string = 'equipe';
  evenement: Evenement = new Evenement(); // Initialize Evenement object
  selectedEquipe: number; // Define selectedEquipe property here
  selectedEquipe2: Equipe;
  selectedMembers: number[] = []; // Define selectedMembers property here
  typeRepetitions: string[] = Object.values(TypeRepetition).filter(value => typeof value === 'string').map(value => String(value));
  selectedTypeRepetition: string;
  step1: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private eventService: EvenementService,
    private router: Router
  ) {
  }

  nextStep() {
    this.step1 = false;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getEquipes();
    this.getMembers();
  }

  initializeForm(): void {
    this.evenementForm = this._formBuilder.group({
      nom: ['', Validators.required],
      lieu: ['', Validators.required],
      date: ['', Validators.required],
      horraire: ['', Validators.required],
      description: ['', Validators.required],
      repetition: [false, Validators.required],
      typeRepetition: [TypeRepetition.SEMAINE, Validators.required],
      nbRepetition: [''],
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

  changeOption(option: string): void {
    this.selectedOption = option;
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
      this.evenement.typeRepetition = formData.typeRepetition;
      this.evenement.nbRepetition = formData.nbRepetition;

      let request: PersonnaliseRequest;
      if (this.selectedOption === 'equipe') {
        request = new PersonnaliseRequest(this.evenement, this.selectedEquipe, []);
      } else {
        request = new PersonnaliseRequest(this.evenement, null, this.selectedMembers);
      }

      this.eventService.addPersonnalise(request).subscribe(
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
