import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Manager } from 'src/models/manager.model';
import { ManagerService } from 'src/app/services/manager.service';
import { DatePipe } from '@angular/common';
import { Academie } from 'src/models/academie.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, RoleArray } from 'src/models/enums/role.model';
import { RoleName, RoleNameArray } from 'src/models/roleName.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSort } from '@angular/material/sort';
import { Observable, forkJoin } from 'rxjs';
import { PaiementService } from 'src/app/services/paiement.service';
import { Equipe } from 'src/models/equipe.model';

@Component({
  selector: 'app-staff-list',
  templateUrl: './stafflist.component.html',
})
export class AppStafflistComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);

  displayedColumns: string[] = [
    'photo',
    'firstname',
    'email',
    'roleName',
    'telephone',
    'equipe',
    'adresse',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<Manager>([]);

  statutOptions: string[] = ['true', 'false'];
  selectedEquipe: string | null = null;
  nomEquipeOptions: string[] = [];
  rolesOptions: string[] = [];
  selectedSortingOption: string | null = null;
  selectedStatut: string | null = null;
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' },
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  action: string;
  local_data: any;
  roleNames: string[] = [];
  managerForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    public datePipe: DatePipe,
    public managerService: ManagerService,
    private formBuilder: FormBuilder,
    private paiementService: PaiementService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  displayedData: any[] = [];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Manager>([]);
    this.fetchRoleNames();
    this.getManagers();
    this.getEquipeNames();
   // this.getRolesOptions();
  }

  applyFilterByStatut(): void {
    // Apply the filter by Statut if selectedStatut is not null
    if (this.selectedStatut !== null) {
      // Convert the selectedStatut to lowercase for case-insensitive comparison
      const filter = this.selectedStatut.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Manager, filter: string) => {
        // Check if the statut matches the filter value exactly
        return data.blocked.toString().toLowerCase() === filter;
      };

      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedStatut is null
      this.applyFilter('');
    }
  }
  
  // getRolesOptions(): void {
  //   this.managerService.getOnlyRoleNames().subscribe((roles: RoleName[]) => {
  //     this.rolesOptions = roles.map((role: RoleName) => role);
  //   });
  // }
  

  getEquipeNames(): void {
    this.paiementService.getEquipes().subscribe((equipes: Equipe[]) => {
      this.nomEquipeOptions = equipes.map((equipe: Equipe) => equipe.nom);
    });
  }

  applyFilterByEquipe(): void {
    // Apply the filter by Equipe if selectedEquipe is not null
    if (this.selectedEquipe !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedEquipe.trim().toLowerCase();

      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Manager, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.nomEquipe, filter);
      };

      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedEquipe is null
      this.applyFilter('');
    }
  }

  matchesFilter(value: any, filter: string): boolean {
    // Convert value to string if it's not already
    const stringValue = value ? value.toString().toLowerCase() : '';
    // Check if the string value contains the filter value
    return stringValue.includes(filter);
  }

  applyFilter(filterValue: string): void {
    // Convert filter value to lowercase for case-insensitive comparison
    const filter = filterValue.trim().toLowerCase();

    // Set filter function for data source
    this.dataSource.filterPredicate = (data: Manager, filter: string) => {
      // Check if any attribute matches the filter value
      return (
        this.matchesFilter(data.firstname, filter) ||
        this.matchesFilter(data.lastname, filter) ||
        this.matchesFilter(data.email, filter) ||
        this.matchesFilter(data.telephone, filter) ||
        this.matchesFilter(data.adresse, filter) ||
        this.matchesFilter(data.nomEquipe, filter) ||
        this.matchesFilter(data.role, filter) || 
        this.matchesFilter(data.roleName, filter) 
      );
    };
    this.dataSource.filter = filter;
  }

  applySorting() {
    if (this.selectedSortingOption === 'asc') {
      this.dataSource.data.sort((a, b) => {
        const memberA = `${a.firstname} ${a.lastname}`.toLowerCase();
        const memberB = `${b.firstname} ${b.lastname}`.toLowerCase();
        return memberA.localeCompare(memberB);
      });
    } else if (this.selectedSortingOption === 'desc') {
      this.dataSource.data.sort((a, b) => {
        const memberA = `${a.firstname} ${a.lastname}`.toLowerCase();
        const memberB = `${b.firstname} ${b.lastname}`.toLowerCase();
        return memberB.localeCompare(memberA);
      });
    }
    // After sorting, reassign the sorted data to the dataSource
    this.dataSource = new MatTableDataSource<Manager>(this.dataSource.data);
  }

  resetFilters(): void {
    // Reset selected filters
    this.selectedEquipe = null;
    this.selectedStatut = null;
    this.selectedSortingOption = '';

    // Apply filters again to refresh the data
    this.applyFilter('');
  }

  getManagers(): void {
    this.managerService.getManagers().subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.dataSource.data = managers;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  fetchRoleNames(): void {
    this.managerService.getRoleNames().subscribe((roleNames) => {
      //this.roleNames = roleNames;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    this.managerService.getManagers().subscribe((managers) => {
      this.dataSource.data = managers;
      this.dataSource.paginator = this.paginator;
      console.log(managers);
    });
  }

  initManagerForm(): void {
    this.managerForm = this.formBuilder.group({
      firstname: [this.local_data.firstname, Validators.required],
      lastname: [this.local_data.lastname, Validators.required],
      email: [this.local_data.email, [Validators.required, Validators.email]], // Add Validators.required
      adresse: [this.local_data.adresse, Validators.required],
      role: [this.local_data.role, Validators.required],
      roleName: [
        this.local_data.role !== 'ADHERENT' && this.local_data.role !== 'PARENT'
          ? this.local_data.roleName
          : null,
        this.local_data.role !== 'ADHERENT' && this.local_data.role !== 'PARENT'
          ? Validators.required
          : null,
      ],
      photo: [null, Validators.required],
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppStaffDialogContentComponent, {
      data: { ...obj, managerForm: this.managerForm },
    });

    //here we will just reload or display the changes instantly but the real work will be in the dialog
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event) {
        if (result.event === 'Add') {
          this.addRowData(result.data);
        } else if (result.event === 'Update') {
          this.updateRowData(result.data);
        } else if (result.event === 'Delete') {
          this.deleteRowData(result.data);
        } else if (result.event === 'Block') {
          this.blockRowData(result.data);
        } else if (result.event === 'UnBlock') {
          this.unblockRowData(result.data);
        }
        this.getManagers();
      }
    });
  }
  showRoleInput: boolean = false;
  onRoleChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showRoleInput =
      selectedValue === 'STAFF' || selectedValue === 'ENTRAINEUR';
    // this.sendRequestBasedOnRole(selectedValue);
    console.log('selectedValue', selectedValue);
  }

  deleteRowData(deletedData: any) {
    this.displayedData = this.displayedData.filter(
      (item) => item.id !== deletedData.id
    );
  }

  addRowData(managerData: Manager): void {
    // const role = this.managerForm.get('role')?.value;
    // this.sendRequestBasedOnRole(role);
    // console.log("role",role);
  }
  // sendRequestBasedOnRole(role: string) {
  //   switch (role) {
  //     case 'STAFF':
  //       if (this.managerForm.valid) {
  //       this.managerService.addStaff(this.managerForm.value).subscribe(
  //         (response) => {
  //           console.log(this.managerForm.value); // Handle successful response
  //           console.log('Manager added:', response);
  //         },
  //         (error) => {
  //           // Handle error
  //           console.error('Error adding manager:', error);
  //         }
  //       );
  //     } else {
  //       console.error('Form is not valid. Please fill out all required fields.');
  //     }
  //       break;
  //     case 'ENTRAINEUR':
  //       if (this.managerForm.valid) {
  //       this.managerService.addEntraineur(this.managerForm.value).subscribe(
  //         (response) => {
  //           console.log(this.managerForm.value); // Handle successful response
  //           console.log('Manager added:', response);
  //         },
  //         (error) => {
  //           // Handle error
  //           console.error('Error adding manager:', error);
  //         }
  //       );
  //     } else {
  //       console.error('Form is not valid. Please fill out all required fields.');
  //     }
  //       break;
  //       case 'ADHERENT':
  //         if (this.managerForm.valid) {
  //           this.managerService.addAdherent(this.managerForm.value).subscribe(
  //             (response) => {
  //               console.log(this.managerForm.value); // Handle successful response
  //               console.log('adherent added:', response);
  //             },
  //             (error) => {
  //               // Handle error
  //               console.error('Error adding manager:', error);
  //             }
  //           );
  //         } else {
  //           console.error('Form is not valid. Please fill out all required fields.');
  //         }
  //         break;

  //     case 'PARENT':
  //       // this.getParentData();
  //       break;
  //     default:
  //       break;
  //   }
  //}

  // tslint:disable-next-line - Disables all
  updateRowData(managerData: Manager): void {
    this.table.renderRows();
    //   this.managerService.updateManager(managerData).subscribe(
    //   (response)=>{
    //     console.log('Manager updated successfully', response);
    //     this.getManagers();
    //   },
    //   (error)=> {
    //     console.error('Error archiving academie', error);
    //   }
    //  )
  }

  // tslint:disable-next-line - Disables all
  // deleteRowData(managerData: Manager): boolean | any {
  //   this.dataSource.data = this.dataSource.data.filter((value, key) => {
  //     return value.id !== managerData.id;
  //   });
  // }

  blockRowData(managerData: Manager): void {
    this.table.renderRows();
    // this.managerService.blockManager(managerData.id).subscribe(
    //   (response) => {
    //     console.log('Manager blockManager successfully', response);
    //     this.getManagers(); // Reload the data after blocking
    //     this.table.renderRows();
    //   },
    //   (error) => {
    //     console.error('Error archiving manager', error);
    //     // Handle error, if needed
    //   }
    // );
  }

  unblockRowData(managerData: Manager): void {
    this.table.renderRows();
    // this.managerService.unBlockManager(managerData.id).subscribe(
    //   (response) => {
    //     console.log('Manager unblocked successfully', response);
    //     this.getManagers();
    //   },
    //   (error) => {
    //     console.error('Error unblocking academie', error);
    //     // Handle error, if needed
    //   }
    // );
  }
}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'staff-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppStaffDialogContentComponent implements OnInit {
  action: string;
  local_data: any;
  managerForm: FormGroup;
  firstnameValue: string;
  roles: string[];
  roleNames: string[];

  dataSource = new MatTableDataSource<string>([]);
  managerSource = new MatTableDataSource<Manager>([]);

  constructor(
    public dialogRef: MatDialogRef<AppStaffDialogContentComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { managerForm: FormGroup; data: Manager },
    private firestorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private managerService: ManagerService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  showRoleInput: boolean = false;
  photo: string;
  onRoleChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showRoleInput =
      selectedValue === 'STAFF' || selectedValue === 'ENTRAINEUR';
    //this.sendRequestBasedOnRole(selectedValue);
    console.log('role', selectedValue);
  }

  displayedData: any[] = [];

  ngOnInit(): void {
    this.initManagerForm();
    //this.dataSource = new MatTableDataSource<string>([]);
    this.getOnlyRoleNames();
  }

  getOnlyRoleNames(): void {
    this.managerService.getOnlyRoleNames().subscribe(
      (roleNames) => {
        console.log('Managers fetched successfully', roleNames);
        this.roleNames = roleNames;
        this.dataSource.data = roleNames;
        console.log(roleNames);
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.managerService.getOnlyRoleNames().subscribe(
      (roleNames) => {
        console.log('Managers fetched successfully', roleNames);
        this.dataSource.data = roleNames;
        console.log(roleNames);
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  initManagerForm(): void {
    this.managerForm = this.formBuilder.group({
      firstname: [this.local_data.firstname, Validators.required],
      lastname: [this.local_data.lastname, Validators.required],
      email: [this.local_data.email, [Validators.required, Validators.email]], // Add Validators.required
      adresse: [this.local_data.adresse, Validators.required],
      role: [this.local_data.role, Validators.required],
      roleName: [
          this.local_data.role === 'ADHERENT' || this.local_data.role === 'PARENT'
            ? null
            : this.local_data.roleName
      ],
      photo: [this.local_data.photo],
      telephone: [this.local_data.telephone, Validators.required],
    });
  }

  getManagers(): void {
    this.managerService.getManagers().subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.managerSource.data = managers;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  doAction(): void {
    if (this.action === 'Add') {
      const role = this.managerForm.get('role')?.value;
      console.log('role', role);
      const addedManager = this.managerForm.value;

      let addObservable = new Observable<any>();
      switch (role) {
        case 'STAFF':
          if (this.managerForm.valid) {
            const managerWithPhoto = { ...addedManager, photo: this.photo };

            addObservable = this.managerService.addStaff(managerWithPhoto);
            console.log('photo 2', this.photo);
          } else {
            console.error(
              'Form is not valid. Please fill out all required fields.'
            );
          }
          break;
        case 'ENTRAINEUR':
          if (this.managerForm.valid) {
            const managerWithPhoto = { ...addedManager, photo: this.photo };
            addObservable = this.managerService.addEntraineur(managerWithPhoto);
          } else {
            console.error(
              'Form is not valid. Please fill out all required fields.'
            );
          }
          break;
        case 'ADHERENT':
          if (this.managerForm.valid) {
            const managerWithPhoto = { ...addedManager, photo: this.photo };
            addObservable = this.managerService.addAdherent(managerWithPhoto);
          } else {
            console.error(
              'Form is not valid. Please fill out all required fields.'
            );
          }
          break;

        case 'PARENT':
          break;

        default:
          console.error('Invalid role:', role);
          return; // Exit function if role is invalid
      }
      addObservable.subscribe(
        (response) => {
          console.log('Manager updated:', response);
          this.dialogRef.close({ event: this.action });
        },
        (error) => {
          console.error('Error updating manager:', error);
        }
      );
    } else if (this.action === 'Update') {
      const updatedManager = this.managerForm.value;
      updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
      updatedManager.photo = this.local_data.photo
      const role = updatedManager.role;
      let updateObservable;
      switch (role) {
        case 'STAFF':
          //const staffWithPhoto = { ...updatedManager, photo: this.photo2 };
          updateObservable = this.managerService.updateStaff(updatedManager);
          break;
        case 'ENTRAINEUR':
          //const entraineurWithPhoto = { ...updatedManager, photo: this.photo2 };
          updateObservable = this.managerService.updateEntraineur(updatedManager);
          break;
        case 'ADHERENT':
          const adherentWithPhoto = { ...updatedManager, photo: this.photo };

          updateObservable = this.managerService.updateAdherent(adherentWithPhoto);
          break;
        case 'PARENT':
          const parentWithPhoto = { ...updatedManager, photo: this.photo };

          updateObservable = this.managerService.updateParent(parentWithPhoto);
          break;
        default:
          console.error('Invalid role:', role);
          return; // Exit function if role is invalid
      }
      updateObservable.subscribe(
        (response) => {
          console.log('Manager updated:', response);
          this.dialogRef.close({ event: this.action });
        },
        (error) => {
          console.error('Error updating manager:', error);
        }
      );
    } else if (this.action === 'Block') {
      const blockAction = this.local_data.blocked
        ? 'unBlockManager'
        : 'blockManager';
      this.managerService[blockAction](this.local_data.id).subscribe(
        (response: any) => {
          console.log('Manager action successful', response);
          this.dialogRef.close({ event: this.action });
        },
        (error: any) => {
          console.error('Error', error);
          this.dialogRef.close({ event: this.action });
        }
      );
    } else {
      this.dialogRef.close({ event: 'Cancel' });
    }
  }

  async uploadFile(event: any) {
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
      this.local_data.photo = url;
      this.photo = url;
      console.log('photo 2', this.photo);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
