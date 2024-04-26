import { Component } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'add-competition',
    standalone: true,
    imports: [MaterialModule, FormsModule, ReactiveFormsModule],
    templateUrl: './addCompetition.component.html',
})
export class AddCompetitionComponent {
    constructor(private _formBuilder: FormBuilder) { }
}
