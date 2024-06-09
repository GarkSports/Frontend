import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EquipeService } from "src/app/services/equipe.service";
import { Discipline } from "src/models/discipline.model";
import { Equipe } from "src/models/equipe.model";

@Component({
    selector: 'app-add-equipe',
    templateUrl: './addEquipe.component.html',
})
export class AddEquipeComponent {

    uploadingImage: boolean = false;
    equipes: Equipe[] = [];
    genres = ['HOMME', 'FEMME', 'MIXTE'];
    disciplines: Discipline[] = [];
    forms: NgForm[] = [];


    constructor(
        public dialog: MatDialog,
        public datePipe: DatePipe,
        private equipeService: EquipeService,
        private firestorage: AngularFireStorage,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.equipes.push(this.createEmptyEquipe());
        this.getDisciplines();
    }

    getDisciplines(): void {
        this.equipeService.getDisciplines()
            .subscribe(disciplines => this.disciplines = disciplines);
    }

    addEquipeForm(): void {
        this.equipes.push(this.createEmptyEquipe());
    }

    areAllFormsValid(): boolean {
        return this.forms.every(form => form.valid);
    }

    async uploadFile(event: any, equipe: Equipe) {
        this.uploadingImage = true;
        const file = event.target.files[0];
        if (file) {
            const path = `academie/${file.name}`;
            const uploadTask = this.firestorage.upload(path, file);
            uploadTask.then(async (snapshot) => {
                const url = await snapshot.ref.getDownloadURL();
                console.log('Image URL:', url);
                equipe.logo = url;
            }).catch(error => {
                console.error('Error uploading image:', error);
            }).finally(() => {
                this.uploadingImage = false;
            });
        } else {
            this.uploadingImage = false;
        }
    }

    onSubmit(): void {
        for (const equipe of this.equipes) {
            const disciplineId = equipe.discipline?.id;
            if (disciplineId !== undefined) {
                this.equipeService.addEquipe(equipe, disciplineId)
                    .subscribe(() => {
                        this.router.navigate(['/apps/equipe']);
                        // Optionally handle success
                    }, error => {
                        console.error('Error adding equipe:', error);
                    });
            } else {
                console.error("Discipline is undefined.");
            }
        }

        // Reset the form array after submission
        this.equipes = [this.createEmptyEquipe()];
    }

    removeEquipeForm(index: number): void {
        this.equipes.splice(index, 1);
    }

    createEmptyEquipe(): Equipe {
        const equipe = new Equipe();
        equipe.couleur = '#000000';
        return equipe;
    }

}