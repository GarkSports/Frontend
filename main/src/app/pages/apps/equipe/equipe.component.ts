import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EquipeService } from 'src/app/services/equipe.service';
import { Adherent } from 'src/models/adherent.model';
import { Discipline } from 'src/models/discipline.model';
import { Entraineur } from 'src/models/entraineur.model';
import { GenreEquipe } from 'src/models/enums/genreEquie.model';
import { Equipe } from 'src/models/equipe.model';

@Component({
  templateUrl: './equipe.component.html',
})
export class EquipeComponent implements AfterViewInit {
  @ViewChild('equipeForm', { static: false }) equipeForm: NgForm;
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'logo',
    'nom',
    'genre',
    'discipline',
    'groupAge',
    'couleur',
    'codeEquipe',
    'adherents',
    'addMember',
    'entraineurs',
    'addEntraineur',
    'action'
  ];

  dataSource = new MatTableDataSource<Equipe>([]);

  members: Adherent[] = [];
  coachs: Entraineur[] = [];
  disciplines: Discipline[] = [];
  entraineurs: Entraineur[] = [];
  genres = ['HOMME', 'FEMME', 'MIXTE'];
  equipeList: Equipe[] = [];
  uploadingImage: boolean = false;

  equipe: Equipe;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);


  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private equipeService: EquipeService,
    private firestorage: AngularFireStorage,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.equipe = new Equipe();
    this.equipe.couleur = '#000000';
    this.getMembers();
    this.getDisciplines();
    this.getEntraineurs();
    this.getEquipes();
  }

  getMembers(): void {
    this.equipeService.getMembers()
      .subscribe(members => this.members = members);
  }

  getDisciplines(): void {
    this.equipeService.getDisciplines()
      .subscribe(disciplines => this.disciplines = disciplines);
  }

  getEntraineurs(): void {
    this.equipeService.getEntraineurs()
      .subscribe(entraineurs => this.entraineurs = entraineurs);
  }

  getEquipes(): void {
    this.equipeService.getEquipes().subscribe(equipes => {
      this.equipeList = equipes;
      this.dataSource.data = this.equipeList;
    });
  }

  onSubmit(): void {
    if (this.equipe) {
      const disciplineId = this.equipe.discipline?.id; // Optional chaining for discipline
      if (disciplineId !== undefined) {
        this.equipeService.addEquipe(this.equipe, disciplineId)
          .subscribe(() => {
            // Reset form and disable validation
            this.equipeForm.resetForm();

            // Reset form
            this.equipe = new Equipe();
            this.equipe.couleur = '#000000';
            // Reload equipes
            this.getEquipes();
            this.getMembers();
            this.getEntraineurs();
            // Render table rows
            this.table.renderRows();
          });
      } else {
        console.error("Discipline is undefined.");
      }
    } else {
      console.error("Equipe is undefined.");
    }
  }

  // Modify your uploadFile method to call the resetUploadStatus method
  async uploadFile(event: any) {
    this.uploadingImage = true;
    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = this.firestorage.upload(path, file);
      uploadTask.then(async (snapshot) => {
        const url = await snapshot.ref.getDownloadURL();
        console.log('Image URL:', url);
        this.equipe.logo = url; // Update the updatedAcademie.logo with the new URL
      }).catch(error => {
        console.error('Error uploading image:', error);
      }).finally(() => {
        this.uploadingImage = false; // Reset uploadingImage flag regardless of success or failure
      });
    } else {
      this.uploadingImage = false; // Reset uploadingImage flag if no file is selected (canceled)
    }
  }



  onDeleteEquipe(equipeId: number): void {
    this.equipeService.deleteEquipe(equipeId).subscribe(() => {
      // Reload equipes
      this.getEquipes();
      this.getMembers();
      this.getEntraineurs();
    }, error => {
      // Handle error, if needed
      console.error('Error deleting equipe:', error);
    });
  }

  showAdherentsPopup(adherents: Adherent[]): void {
    const dialogRef = this.dialog.open(AdherentPopupComponent, {
      data: { adherents },
    });

    dialogRef.afterClosed().subscribe(() => {
      // This will be executed after the dialog is closed
      this.getEquipes();
      this.getMembers();
      this.getEntraineurs();
    });
  }

  showEntraineursPopup(entraineurs: Entraineur[]): void {
    const dialogRef = this.dialog.open(EntraineurPopupComponent, {
      data: { entraineurs },
    });

    dialogRef.afterClosed().subscribe(() => {
      // This will be executed after the dialog is closed
      this.getEquipes();
      this.getMembers();
      this.getEntraineurs();
    });
  }



  openAddMemberPopup(equipe: Equipe): void {
    const dialogRef = this.dialog.open(AddMemberPopupComponent, {
      data: { equipeId: equipe.id }
    });

    dialogRef.afterClosed().subscribe((selectedMemberIds: number[]) => {
      if (selectedMemberIds && selectedMemberIds.length > 0) {
        this.affectMembersToEquipe(equipe.id, selectedMemberIds);
      }
    });
  }

  affectMembersToEquipe(equipeId: number, memberIds: number[]): void {
    this.equipeService.affectMembersToEquipe(equipeId, memberIds).subscribe(
      (result) => {
        // Handle success, if needed
        console.log('Members affected to equipe:', result);
        this.getEquipes();
        this.getMembers();
        this.getEntraineurs();
      },
      (error) => {
        // Handle error, if needed
        console.error('Error affecting members to equipe:', error);
      }
    );
  }

  openAddEntraineurPopup(equipe: Equipe): void {
    const dialogRef = this.dialog.open(AddCoachPopupComponent, {
      data: { equipeId: equipe.id }
    });

    dialogRef.afterClosed().subscribe((selectedEntraineurIds: number[]) => {
      if (selectedEntraineurIds && selectedEntraineurIds.length > 0) {
        this.affectEntraineursToEquipe(equipe.id, selectedEntraineurIds);
      }
    });
  }

  affectEntraineursToEquipe(equipeId: number, entraineurIds: number[]): void {
    this.equipeService.affectCoachsToEquipe(equipeId, entraineurIds).subscribe(
      (result) => {
        // Handle success, if needed
        console.log('Entraineurs affected to equipe:', result);
        this.getEquipes();
        this.getMembers();
        this.getEntraineurs();
      },
      (error) => {
        // Handle error, if needed
        console.error('Error affecting entraineurs to equipe:', error);
      }
    );
  }

  openUpdateDialog(equipe: Equipe): void {
    const dialogRef = this.dialog.open(UpdateEquipePopupComponent, {
      data: equipe
    });

    dialogRef.afterClosed().subscribe(updatedPaiement => {
      if (updatedPaiement) {
        // Handle dialog result if needed
        this.getEquipes();
      }
    });
  }
}

@Component({
  selector: 'app-update-equipe-popup',
  templateUrl: './updateEquipe.component.html',
})
export class UpdateEquipePopupComponent {
  genreEquipe: string[] = Object.values(GenreEquipe)
    .filter(value => typeof value === 'string')
    .map(value => String(value));
  uploadingImage: boolean = false;

  constructor(public dialogRef: MatDialogRef<UpdateEquipePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public equipe: Equipe, private equipeService: EquipeService, private firestorage: AngularFireStorage,) { }



  onCancelClick(): void {
    this.dialogRef.close();
  }
  onUpdateClick(): void {
    if (this.equipe) {
      const updatedEquipeData = {
        nom: this.equipe.nom,
        genre: this.equipe.genre,
        groupeAge: this.equipe.groupeAge,
        couleur: this.equipe.couleur,
        logo: this.equipe.logo,
      };
      const updatedEquipe: Partial<Equipe> = { ...updatedEquipeData };
      this.equipeService.updateEquipe(updatedEquipe as Equipe, this.equipe.id)
        .subscribe(
          response => {
            console.log('Equipe updated:', response);
            this.dialogRef.close(response); // Close dialog with response
          },
          error => {
            console.error('Error updating payment:', error);
            // Handle error if necessary
          }
        );
    } else {
      console.error('Equipe is undefined');
      // Handle case where paiement is undefined
    }
  }

  async uploadFile(event: any) {
    this.uploadingImage = true;
    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = this.firestorage.upload(path, file);
      uploadTask.then(async (snapshot) => {
        const url = await snapshot.ref.getDownloadURL();
        console.log('Image URL:', url);
        this.equipe.logo = url; // Update the updatedAcademie.logo with the new URL
        this.uploadingImage = false;
      }).catch(error => {
        console.error('Error uploading image:', error);
      }).finally(() => {
        this.uploadingImage = false; // Reset uploadingImage flag regardless of success or failure
      });
    } else {
      this.uploadingImage = false; // Reset uploadingImage flag if no file is selected (canceled)
    }
  }
}

@Component({
  selector: 'app-adherent-popup',
  templateUrl: './adherentPopup.component.html',
})
export class AdherentPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { adherents: Adherent[] }, private dialogRef: MatDialogRef<AdherentPopupComponent>, private equipeService: EquipeService) { }
  removeAdherent(adherentId: number): void {
    this.equipeService.removeAdherentFromEquipe(adherentId).subscribe(() => {
      // Close the dialog after the adherent is removed
      this.dialogRef.close();
    }, error => {
      // Handle error, if needed
      console.error('Error removing adherent:', error);
    });
  }
}


@Component({
  selector: 'app-entraineur-popup',
  templateUrl: './entraineurPopup.component.html',
})
export class EntraineurPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { entraineurs: Entraineur[] }, private dialogRef: MatDialogRef<AdherentPopupComponent>, private equipeService: EquipeService) { }
  removeEntraineur(entraineurId: number): void {
    this.equipeService.removeEntraineurFromEquipe(entraineurId).subscribe(() => {
      // Close the dialog after the adherent is removed
      this.dialogRef.close();
    }, error => {
      // Handle error, if needed
      console.error('Error removing adherent:', error);
    });
  }
}



@Component({
  selector: 'app-add-member-popup',
  templateUrl: './addMemberPopup.component.html',
})
export class AddMemberPopupComponent {
  members: Adherent[] = [];
  filteredMembers: Adherent[] = [];
  selectedMembers: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMemberPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipeId: number },
    private equipeService: EquipeService
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.equipeService.getMembers()
      .subscribe(members => {
        this.members = members;
        this.filteredMembers = members; // Initialize filtered list with all members
      });
  }

  selectMembers(selection: MatSelectionListChange): void {
    this.selectedMembers = selection.source.selectedOptions.selected.map(option => option.value);
  }

  applyFilter(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.firstname.toLowerCase().includes(filterValue) ||
      member.lastname.toLowerCase().includes(filterValue)
    );
  }

  close(): void {
    this.dialogRef.close(this.selectedMembers);
  }
}


@Component({
  selector: 'app-add-coach-popup',
  templateUrl: './addCoachPopup.component.html',
})
export class AddCoachPopupComponent {
  coachs: Entraineur[] = [];
  filteredCoachs: Entraineur[] = [];
  selectedCoachs: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddCoachPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipeId: number },
    private equipeService: EquipeService
  ) { }

  ngOnInit(): void {
    this.getCoachs();
  }

  getCoachs(): void {
    this.equipeService.getEntraineurs()
      .subscribe(coachs => {
        this.coachs = coachs;
        this.filteredCoachs = coachs; // Initialize filtered list with all coaches
      });
  }

  selectCoachs(selection: MatSelectionListChange): void {
    this.selectedCoachs = selection.source.selectedOptions.selected.map(option => option.value);
  }

  applyFilter(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredCoachs = this.coachs.filter(coach =>
      coach.firstname.toLowerCase().includes(filterValue) ||
      coach.lastname.toLowerCase().includes(filterValue)
    );
  }

  close(): void {
    this.dialogRef.close(this.selectedCoachs);
  }
}


