import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Equipe } from 'src/models/equipe.model';
import { EntrainementService } from 'src/app/services/entrainement.service';
import { ConvocationEntrainement } from 'src/models/convocationEntrainement.model';
import { Adherent } from 'src/models/adherent.model';

interface TeamSchedule {
  id: number;
  team: string;
  month: number;
  year: number;
  schedule: { [key: string]: { heure: string, id: number } };
  adherents: Adherent[];
}

@Component({
  selector: 'app-entrainement',
  templateUrl: './entrainement.component.html',
  styleUrls: ['./entrainement.component.css']
})
export class EntrainementComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  displayedColumns: string[] = ['team', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  weekDays: string[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  teamSchedules: TeamSchedule[] = [];
  currentDate: Date = new Date();
  currentWeekRange: string = '';
  weekDates: { [key: string]: string } = {};

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private entrainementService: EntrainementService
  ) { }

  ngAfterViewInit(): void {
    this.renderWeek();
    this.loadEntrainements();
  }

  renderWeek(): void {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    this.currentWeekRange = `Du ${this.datePipe.transform(startOfWeek, 'dd MMM')} au ${this.datePipe.transform(endOfWeek, 'dd MMM')}`;

    this.weekDates = {};
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const day = this.weekDays[i];
      this.weekDates[day] = this.datePipe.transform(currentDate, 'dd-MM-yyyy') || '';
    }

    this.table.dataSource = this.teamSchedules;
  }

  loadEntrainements(): void {
    this.entrainementService.getEntrainements().subscribe(equipes => {
      this.teamSchedules = equipes.map(equipe => this.mapToTeamSchedule(equipe));
      this.table.dataSource = this.teamSchedules;
    });
  }

  mapToTeamSchedule(equipe: Equipe): TeamSchedule {
    const schedule: { [key: string]: { heure: string, id: number } } = {};

    if (equipe.convocations && equipe.convocations.length > 0) {
      equipe.convocations.forEach(convocation => {
        const convocationDate = new Date(convocation.date);
        const formattedDate = this.datePipe.transform(convocationDate, 'dd-MM-yyyy');

        for (const day of this.weekDays) {
          if (formattedDate === this.weekDates[day]) {
            if (convocation.id !== undefined) {
              schedule[day] = { heure: convocation.heure, id: convocation.id };
            }
          }
        }
      });

      const firstConvocation = equipe.convocations[0];
      const firstDate = new Date(firstConvocation.date);
      return {
        id: equipe.id,
        team: equipe.nom,
        month: firstDate.getMonth(),
        year: firstDate.getFullYear(),
        schedule: schedule,
        adherents: equipe.adherents || []
      };
    } else {
      const currentDate = new Date();
      return {
        id: equipe.id,
        team: equipe.nom,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        schedule: schedule,
        adherents: equipe.adherents || []
      };
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.renderWeek();
    this.loadEntrainements(); // Reload data for the new week
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.renderWeek();
    this.loadEntrainements(); // Reload data for the new week
  }

  openAddHeureDialog(team: string, date: string, adherents: Adherent[], idEquipe: number): void {
    const dialogRef = this.dialog.open(AddHeureDialogComponent, {
      width: '500px',
      data: { team, date, adherents  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assume result is an object with ConvocationEntrainement and a list of adherent IDs
        const { convocationEntrainement, idAdherents } = result;
        this.entrainementService.addEntrainement(convocationEntrainement, idEquipe, idAdherents).subscribe(newConvocation => {
          // Handle success or error accordingly
          this.loadEntrainements();
        });
      }
    });
  }

  openUpdateHeureDialog(convocation: ConvocationEntrainement, adherents: Adherent[], idConvocation: number): void {
    const dialogRef = this.dialog.open(UpdateHeureDialogComponent, {
      width: '500px',
      data: {convocation,adherents,idConvocation} // Pass the current ConvocationEntrainement object
    });
  
    dialogRef.afterClosed().subscribe(updatedConvocation => {
      if (updatedConvocation) {
        this.loadEntrainements();
      }
    });
  }

  deleteConvocation(idConvocation: number): void {
    console.log('Delete convocation with ID:', idConvocation);
    this.entrainementService.deleteEntrainement(idConvocation).subscribe(() => {
      this.loadEntrainements(); // Reload the schedule after deletion
    });
  }
}

export interface DialogData {
  team: string;
  date: string;
  adherents: Adherent[];
}

@Component({
  selector: 'app-add-heure-dialog',
  templateUrl: './add-heure-dialog.component.html',
})
export class AddHeureDialogComponent {
  heure: string = '';
  date: Date;
  convocationEntrainement: ConvocationEntrainement = new ConvocationEntrainement();
  selectedAdherents: number[] = []; // Array to store selected adherent IDs

  constructor(
    public dialogRef: MatDialogRef<AddHeureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    const parts = data.date.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    this.date = new Date(formattedDate);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Update the heure and date fields of convocationEntrainement
    this.convocationEntrainement.heure = this.heure;
    this.convocationEntrainement.date = this.date;

    // Pass the convocationEntrainement object and selected adherent IDs back to the parent component
    this.dialogRef.close({
      convocationEntrainement: this.convocationEntrainement,
      idAdherents: this.selectedAdherents
    });
  }

  onAdherentCheckboxChange(adherentId: number, checked: boolean): void {
    if (checked) {
      // Add the adherent ID to the selectedAdherents array
      this.selectedAdherents.push(adherentId);
    } else {
      // Remove the adherent ID from the selectedAdherents array
      const index = this.selectedAdherents.indexOf(adherentId);
      if (index !== -1) {
        this.selectedAdherents.splice(index, 1);
      }
    }
  }
}



@Component({
  selector: 'app-update-heure-dialog',
  templateUrl: './update-heure-dialog.component.html'
})
export class UpdateHeureDialogComponent implements OnInit {
  heure: string;
  selectedAdherents: number[];

  constructor(
    public dialogRef: MatDialogRef<UpdateHeureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { convocation: ConvocationEntrainement, adherents: Adherent[], idConvocation: number }, 
    private entrainementService: EntrainementService
  ) {}

  ngOnInit(): void {
    console.log('Current Convocation:', this.data.idConvocation);
    this.heure = this.data.convocation.heure;
    this.entrainementService.getAdherentsByConvocation(this.data.idConvocation).subscribe(adherents => {
      this.selectedAdherents = adherents.map(adherent => adherent.id);
    });
  }

  onSave(): void {
    // Save the updated values
    const updatedConvocationEntrainement: ConvocationEntrainement = {
      ...this.data.convocation,
      heure: this.heure,
    };
  
    this.entrainementService.updateConvocationEntrainement(updatedConvocationEntrainement, this.selectedAdherents, this.data.idConvocation)
      .subscribe(updatedEquipe => {
        console.log('Updated Equipe:', updatedEquipe);
        this.dialogRef.close(updatedConvocationEntrainement);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdherentCheckboxChange(adherentId: number, checked: boolean): void {
    if (checked) {
      // Add the adherent ID to the selectedAdherents array
      this.selectedAdherents.push(adherentId);
    } else {
      // Remove the adherent ID from the selectedAdherents array
      const index = this.selectedAdherents.indexOf(adherentId);
      if (index !== -1) {
        this.selectedAdherents.splice(index, 1);
      }
    }
  }
}





