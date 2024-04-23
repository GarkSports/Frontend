import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
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
    selectedEquipe: number | null = null;

    constructor(private eventService: EvenementService) { }

    ngOnInit(): void {
        this.getEquipes();
    }

    getEquipes(): void {
        this.eventService.getEquipes().subscribe(equipes => {
            this.equipeList = equipes;
        });
    }

        // Update selectedEquipe when an equipe is selected
        onEquipeSelect(equipeId: number): void {
            this.selectedEquipe = equipeId;
        }
}
