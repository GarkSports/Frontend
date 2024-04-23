import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { EvenementService } from 'src/app/services/evenement.service';
import { Equipe } from 'src/models/equipe.model';
import { Adherent } from 'src/models/adherent.model';

@Component({
    selector: 'add-test',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './addTest.component.html',
})
export class AddTestComponent {
    equipeList: Equipe[] = [];
    memberList: Adherent[] = [];
    selectedOption: string = 'equipe';

    constructor(private eventService: EvenementService) { }

    ngOnInit(): void {
        this.getEquipes();
        this.getMembers();
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
}
