import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EquipeService } from 'src/app/services/equipe.service';
import { Equipe } from 'src/models/equipe.model';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaltest.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class AppEvaluationComponent implements OnInit {
  dataSource = new MatTableDataSource<Equipe>([]);
  equipeCards: Equipe[] = [];
  evaluationForm: FormGroup;
  isEvaluationFormVisible = false;
  evaluation: any = {}; // Define an object to store form data
  local_data: any;
  currentEquipe: Equipe | null = null;

  constructor(
    //public data: Equipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Equipe,

    private equipeService: EquipeService,
    private formBuilder: FormBuilder,
  ) {
    this.local_data = { ...data };
    this.initEvaluationForm();
  }

  

  ngOnInit(): void {
    this.getEquipes();
    this.initEvaluationForm();
    this.dataSource = new MatTableDataSource<Equipe>([]);
  }


  getEquipes(): void {
    this.equipeService.getEquipes().subscribe(equipes => {
      this.equipeCards = equipes;
      this.dataSource.data = equipes;
      this.local_data = equipes;
      console.log("equipes: ",this.local_data);
      this.initEvaluationForm();            
    });
  }

  initEvaluationForm(): void {
    
    this.evaluationForm = this.formBuilder.group({
      genre: [this.local_data.genre, Validators.required],
      nom: [this.local_data.nom, Validators.required],
      codeEquipe: [this.local_data.codeEquipe, Validators.required], // Add Validators.required
    
    });
  }
  
  showEvaluationForm(equipe: Equipe): void {
    this.currentEquipe = equipe;
    this.evaluationForm.patchValue({
      genre: equipe.genre,
      nom: equipe.nom,
      codeEquipe: equipe.codeEquipe,
    });
    this.isEvaluationFormVisible = true;
  }

  saveEvaluation(): void {
    // Add logic to save the evaluation
    this.isEvaluationFormVisible = false;
  }

  cancelEvaluation(): void {
    this.isEvaluationFormVisible = false;
  }

  trackByNom(index: number, equipe: Equipe): string {
    return equipe.nom;
  }
}