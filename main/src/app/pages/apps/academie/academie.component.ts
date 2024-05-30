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
import { AcademieType } from 'src/models/enums/academie-type.model';
import { Etat } from 'src/models/enums/etat.model';

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
  selectedSortingOption: string;
  selectedType: string | null = null;
  selectedEtat: string | null = null;
  typeOptions: string[] = Object.values(AcademieType).filter(value => typeof value === 'string').map(value => String(value));
  etatOptions2: string[] = Object.values(Etat).filter(value => typeof value === 'string').map(value => String(value));
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' }
  ];

  applySorting() {
    if (this.selectedSortingOption === 'asc') {
      this.dataSource.data.sort((a, b) => {
        const academieA = `${a.nom}`.toLowerCase();
        const academieB = `${b.nom}`.toLowerCase();
        return academieA.localeCompare(academieB);
      });
    } else if (this.selectedSortingOption === 'desc') {
      this.dataSource.data.sort((a, b) => {
        const academieA = `${a.nom}`.toLowerCase();
        const academieB = `${b.nom}`.toLowerCase();
        return academieB.localeCompare(academieA);
      });
    }
    // After sorting, reassign the sorted data to the dataSource
    this.dataSource = new MatTableDataSource<Academie>(this.dataSource.data);
  }

  // Helper function to check if a value matches the filter
  matchesFilter(value: any, filter: string): boolean {
    // Convert value to string if it's not already
    const stringValue = value ? value.toString().toLowerCase() : '';
    // Check if the string value contains the filter value
    return stringValue.includes(filter);
  }

  applyFilterByType(): void {
    // Apply the filter by Equipe if selectedEquipe is not null
    if (this.selectedType !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedType.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Academie, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.type, filter);
      };

      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedEquipe is null
      this.applyFilter('');
    }
  }

  applyFilterByEtat(): void {
    // Apply the filter by Equipe if selectedEquipe is not null
    if (this.selectedEtat !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedEtat.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Academie, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.etat, filter);
      };

      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedEquipe is null
      this.applyFilter('');
    }
  }

  resetFilters(): void {
    // Reset selected filters
    this.selectedType = null;
    this.selectedEtat = null;
    this.selectedSortingOption = '';
    this.getAcademies();

    // Apply filters again to refresh the data
    this.applyFilter('');
  }



  getEtatColor(etat: string): { backgroundColor: string } {
    switch (etat) {
      case 'INACTIF':
        return { backgroundColor: '#FF0054' };
      case 'ACTIF':
        return { backgroundColor: '#b8e06a' };
      case 'SUSPENDU':
        return { backgroundColor: '#FF0054' };
      case 'FERME':
        return { backgroundColor: '#FF0054' };
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

    const file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the selected file is an image
      const mimeType = file.type;
      if (!mimeType.match(/image\/*/)) {
        console.error('Only images are supported');
        this.uploadingImage = false;
        return;
      }

      // Display image
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.local_data.imagePath = reader.result;
      };

      try {
        // Upload image
        const path = `academie/${file.name}`;
        const uploadTask = await this.firestorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        console.log('Image URL:', url);
        this.local_data.logo = url;
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        this.uploadingImage = false; // Reset uploadingImage flag regardless of success or failure
      }
    } else {
      // No file selected, reset the uploadingImage flag
      this.uploadingImage = false;
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
