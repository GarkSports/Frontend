import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Academie } from 'src/models/academie.model';
import { AcademieService } from 'src/app/services/academie.service';
import { Manager } from 'src/models/manager.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcademieHistory } from 'src/models/academieHistory.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { User } from 'src/models/user.model';

@Component({
  templateUrl: './academie.component.html',
})
export class AcademieComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  connectedUser: User;

  displayedColumns: string[] = [
    'nom',
    'logo',
    'type',
    'description',
    'fraisAdhesion',
    'etat',
    'editEtat',
    'manager',
    'adresse',
    'etatHistory',
    'action',
  ];

  getEtatColor(etat: string): { backgroundColor: string } {
    switch (etat) {
      case 'INACTIF':
        return { backgroundColor: '#FEF5E5' };
      case 'ACTIF':
        return { backgroundColor: '#E6FFFA' };
      case 'SUSPENDU':
        return { backgroundColor: '#FDEDE8' };
      case 'FERME':
        return { backgroundColor: '#ECF2FF' };
      default:
        return { backgroundColor: 'inherit' }; // Or a default color
    }
  }

  etatOptions = ['ACTIF', 'SUSPENDU', 'INACTIF', 'FERME'];

  dataSource = new MatTableDataSource<Academie>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public academieService: AcademieService,
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getConnectedUserProfile();
    this.getAcademies();
  }

  getConnectedUserProfile(): void {
    this.academieService.getProfil().subscribe(
      (user: User) => {
        this.connectedUser = user;
        console.log('User Profile:', this.connectedUser);
        // You can do further processing with the user profile data here
      },
      (error) => {
        console.error('Error fetching user profile', error);
        // Handle error, if needed
      }
    );
  }


  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppAcademieDialogContentComponent, {
      data: {
        ...obj,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(academieData: Academie): void {
    if (academieData.manager.id) {
      console.log('this is academie data:', academieData);
      this.academieService
        .addAcademie(
          academieData,
          academieData.manager.id
        )
        .subscribe(
          (response) => {
            console.log('Academie added successfully', response);
            this.getAcademies(); // Refresh the data after adding
          },
          (error) => {
            console.error('Error adding academie', error);
            // Handle error, if needed
          }
        );
    }
  }

  updateRowData(academieData: Academie): void {
    // Create a copy of the academieData without the manager_id property
    // const academieDataWithoutManagerId = { ...academieData };
    // delete academieDataWithoutManagerId.manager_id;
    if (academieData.manager.id) {
      const updatedAcademieData = {
        nom: academieData.nom,
        type: academieData.type,
        fraisAdhesion: academieData.fraisAdhesion,
        description: academieData.description,
        rue: academieData.rue,
        ville: academieData.ville,
        codePostal: academieData.codePostal,
        pays: academieData.pays,
        logo: academieData.logo,
      };
      const updatedAcademie: Partial<Academie> = { ...updatedAcademieData };
      this.academieService
        .updateAcademie(
          updatedAcademie as Academie,
          academieData.id,
          academieData.manager.id
        )
        .subscribe(
          (response) => {
            console.log('Academie updated successfully', response);
            this.getAcademies(); // Refresh the data after updating
          },
          (error) => {
            console.error('Error updating academie', error);
            // Handle error, if needed
          }
        );
    }
  }

  deleteRowData(academieData: Academie): void {
    this.academieService.archiveAcademie(academieData.id).subscribe(
      (response) => {
        console.log('Academie archived successfully', response);
        this.getAcademies();
      },
      (error) => {
        console.error('Error archiving academie', error);
        // Handle error, if needed
      }
    );
  }

  getAcademies(): void {
    this.academieService.getAcademies().subscribe(
      (academies) => {
        console.log('Academies fetched successfully', academies);
        this.dataSource.data = academies;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  showManagerDetails(academieId: number): void {
    this.academieService.getManagerDetails(academieId).subscribe(
      (managerDetails) => {
        this.openManagerDetailsDialog(managerDetails);
      },
      (error) => {
        console.error('Error fetching manager details', error);
        // Handle error, if needed
      }
    );
  }

  showAcademieDetails(academieId: number): void {
    this.academieService.getAcademieById(academieId).subscribe(
      (academieDetails) => {
        this.openAcademieDetailsDialog(academieDetails);
      },
      (error) => {
        console.error('Error fetching manager details', error);
        // Handle error, if needed
      }
    );
  }

  openManagerDetailsDialog(managerDetails: Manager): void {
    const dialogRef = this.dialog.open(ManagerDetailsDialogComponent, {
      data: managerDetails,
    });

    // Handle dialog closed event if needed
    dialogRef.afterClosed().subscribe((result) => {
      // Handle result if needed
    });
  }

  openAcademieDetailsDialog(academieDetails: Academie): void {
    const dialogRef = this.dialog.open(AdresseDetailsDialogComponent, {
      data: academieDetails,
    });

    // Handle dialog closed event if needed
    dialogRef.afterClosed().subscribe((result) => {
      // Handle result if needed
    });
  }

  openEditForm(element: any): void {
    const dialogRef = this.dialog.open(EditEtatFormComponent, {
      data: { etat: element.etat, changeReason: '' }, // Pass data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event === 'Save') {
        // Implement the logic to call the backend API and update the etat
        this.academieService.changeEtat(element.id, result.data).subscribe(
          (response) => {
            console.log('Etat changed successfully', response);
            this.getAcademies(); // Refresh the data after changing etat
          },
          (error) => {
            console.error('Error changing etat', error);
            // Handle error, if needed
          }
        );
      }
    });
  }

  openHistoryPopup(academieId: number): void {
    this.academieService.getAcademieHistory(academieId).subscribe((history) => {
      this.dialog.open(HistoryPopupComponent, {
        data: history,
      });
    });
  }
}

@Component({
  selector: 'app-academie-dialog-content',
  templateUrl: 'academie-dialog-content.html',
})
export class AppAcademieDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';

  etatOptions = ['ACTIF', 'SUSPENDU', 'INACTIF', 'FERME'];

  typeOptions = ['ACADEMY', 'CLUB'];

  managers: Manager[] = [];
  uploadingImage: boolean = false;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppAcademieDialogContentComponent>,
    public academieService: AcademieService,
    private firestorage: AngularFireStorage,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Academie
  ) {
    this.local_data = {
      ...data,
    };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd'
      );
    }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/academie/academieLogo.png';
    }
  }

  ngAfterViewInit(): void {
    this.getManagers(this.local_data.id);
  }

  onManagerChange(managerId: any) {
    this.local_data.manager = this.managers.find(manager => manager.id === managerId);
  }


  getManagers(academieId: number): void {
    this.academieService.getManagers(academieId).subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.managers = managers;
      },
      (error) => {
        console.error('Error fetching Managers', error);
      }
    );
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async uploadFile(event: any) {
    this.uploadingImage = true;
    //display image
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
    //upload image
    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('Image URL:', url);
      this.uploadingImage = false;
      this.local_data.logo = url;
    }
  }
}

@Component({
  selector: 'app-manager-details-dialog', // Change the selector to be unique
  templateUrl: 'manager-details-dialog.component.html',
})
export class ManagerDetailsDialogComponent {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: Manager) { }
}

@Component({
  selector: 'app-adresse-details-dialog',
  templateUrl: 'adresse-details-dialog.component.html',
})
export class AdresseDetailsDialogComponent {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: Academie) { }
}

@Component({
  templateUrl: 'etat-edit.html',
})
export class EditEtatFormComponent {
  editForm: FormGroup;

  etatOptions = ['ACTIF', 'SUSPENDU', 'INACTIF', 'FERME'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEtatFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      etat: data.etat,
      changeReason: data.changeReason,
    });
  }

  saveChanges(): void {
    // Implement the logic to save changes
    this.dialogRef.close({ event: 'Save', data: this.editForm.value });
  }

  cancel(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

@Component({
  templateUrl: 'etatHisto.html',
})
export class HistoryPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<HistoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public history: AcademieHistory[]
  ) { }

  close(): void {
    this.dialogRef.close();
  }
  historyColumns: string[] = [
    'previousEtat',
    'newEtat',
    'changeReason',
    'changeDate',
  ];
}
