import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Manager } from 'src/models/manager.model';
import { AdminService } from 'src/app/services/admin.service';
import { DatePipe } from '@angular/common';
import { Academie } from 'src/models/academie.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from 'src/app/services/manager.service';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { StatutManager } from 'src/models/enums/statutManager';
import { AcademieService } from 'src/app/services/academie.service';

@Component({
  selector: 'app-manager-list',
  templateUrl: './managerlist.component.html',
})
export class AppManagerlistComponent implements OnInit {

  statutOptions: string[] = ['true', 'false'];
  selectedAcademie: string | null = null;
  academieOptions: string[] = [];
  selectedSortingOption: string | null = null;
  selectedStatut: string | null = null;
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' }
  ];


  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  totalCount = -1;
  Closed = -1;
  Inprogress = -1;
  Open = -1;

  displayedColumns: string[] = [
    'firstname',
    'email',
    'telephone',   
    'telephone2',
    'academie',
    'adresse',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Manager>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);


  constructor(public dialog: MatDialog,
              public datePipe: DatePipe,
              public adminService: AdminService,
              public academieService: AcademieService){}

  displayedData: any[] = [];
  //sortOrder: string = 'asc'; // default sorting order

  ngOnInit(): void {
    //this.dataSource = new MatTableDataSource<Manager>([]);
    this.getAcademies();
    this.fetchData();
    this.getManagers();
    //this.sortData();
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

//   matchesFilter(value: string | undefined, filter: string): boolean {
//   if (value === undefined || value === null) {
//     return false;
//   }

//   return value.includes(filter);
// }

matchesFilter(value: any, filter: string): boolean {
  // Convert value to string if it's not already
  const stringValue = value ? value.toString().toLowerCase() : '';
  // Check if the string value contains the filter value
  return stringValue.includes(filter);
}

getAcademies(): void {
  this.academieService.getAcademies().subscribe((academies: Academie[]) => {
    this.academieOptions = academies.map((academie: Academie) => academie.nom);
  });
}

  applyFilterByAcademie(): void {
    // Apply the filter by Academie if selectedAcademie is not null
    if (this.selectedAcademie !== null) {
      // Convert filter value to lowercase for case-insensitive comparison
      const filter = this.selectedAcademie.trim().toLowerCase();
  
      // Set filter function for data source
      this.dataSource.filterPredicate = (data: Manager, filter: string) => {
        // Check if Academie matches the selected Academie
        return this.matchesFilter(data.academie?.nom, filter);
      };
  
      // Apply the filter
      this.dataSource.filter = filter;
    } else {
      // Reset the filter if selectedAcademie is null
      this.applyFilter('');
    }
  }

  applyFilter(filterValue: string): void {
    // Convert filter value to lowercase for case-insensitive comparison
    const filter = filterValue.trim().toLowerCase();
  
    // Split the filter value into individual words
    const filterWords = filter.split(' ');
  
    // Set filter function for data source
    this.dataSource.filterPredicate = (data: Manager, filter: string) => {
      // Check if any attribute matches all the filter words
      return filterWords.every(word =>
        this.matchesFilter(data.firstname, word) ||
        this.matchesFilter(data.lastname, word) ||
        this.matchesFilter([data.firstname,data.lastname],  word) ||
        this.matchesFilter(data.email, word) ||
        this.matchesFilter(data.telephone, word) ||
        this.matchesFilter(data.adresse, word) ||
        this.matchesFilter(data.nomEquipe, word) ||
        this.matchesFilter(data.role, word) ||
        this.matchesFilter(data.roleName, word)
      );
    };
  
    this.dataSource.filter = filter;
  }

  // applyFilter(filterValue: string) {
  //   // Convert the filter value to lowercase
  //   filterValue = filterValue.trim().toLowerCase();
  //   // Apply the filter to the dataSource
  //   this.dataSource.filter = filterValue;
  
  //   // Reset the sort after filtering
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  resetFilters(): void {
    // Reset selected filters
    this.selectedAcademie = null;
    this.selectedStatut = null;
    this.selectedSortingOption = '';

    // Apply filters again to refresh the data
    this.applyFilter('');
  }

  getManagers(): void {
    this.adminService.getManagers().subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.dataSource.data = managers;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }
  
  fetchData() {
    // Call your service to fetch the data
    this.adminService.getManagers().subscribe(data => {
      this.displayedData = data;
      this.dataSource = new MatTableDataSource(this.displayedData);
      this.dataSource.sort = this.sort;
    });
  }
  

  ngAfterViewInit(): void {
    this.adminService.getManagers().subscribe(managers => {
      this.dataSource.data = managers;
      this.dataSource.paginator = this.paginator;
      console.log(managers);
    });
  }

  // applyFilter(filterValue: string): void {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppManagerDialogContentComponent, {
      data: obj
    });

    //here we will just reload or display the changes instantly but the real work will be in the dialog
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data.managerData);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
        console.log("helloo");
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      } else if (result.event === 'Block') {
        this.blockRowData(result.data);
      } else if (result.event === 'UnBlock') {
        this.unblockRowData(result.data);
      }
      this.getManagers();

    });
  }

  
  // tslint:disable-next-line - Disables all
  addRowData(newData: any) {
    this.displayedData = [...this.displayedData, newData];
  }
  
  // updateRowData(updatedData: any) {
  //   this.displayedData = this.displayedData.map(item =>
  //     item.id === updatedData.id ? updatedData : item
  //   );
  // }

  updateRowData(row_obj: Manager): boolean | any {
   
  }
  
  deleteRowData(deletedData: any) {
    this.displayedData = this.displayedData.filter(item => item.id !== deletedData.id);
  }
  
  blockRowData(blockedData: any) {
    this.displayedData = this.displayedData.map(item =>
      item.id === blockedData.id ? { ...item, blocked: true } : item
    );
  }
  // blockRowData(local_data: Manager) {
  //   this.displayedData = this.displayedData.map(item =>
  //     item.id === local_data.blocked ? { ...item, blocked: true } : item
  //   );
  // }
  
  unblockRowData(unblockedData: any) {
    this.displayedData = this.displayedData.map(item =>
      item.id === unblockedData.id ? { ...item, blocked: false } : item
    );
  }
  
}

 
@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'manager-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppManagerDialogContentComponent implements OnInit {
  action: string;
  local_data: any;
  managerForm: FormGroup;
  firstnameValue: string;
  isPasswordVisible: boolean = false;

  dataSource = new MatTableDataSource<Manager>([]);

  constructor(
    public dialogRef: MatDialogRef<AppManagerDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private managerService: ManagerService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action ;
    if (this.action === 'Update') {
      this.initManagerForm();
    }
  }
  displayedData: any[] = [];

  ngOnInit(): void {
    this.initManagerForm();
  }

  initManagerForm(): void {
    this.managerForm = this.formBuilder.group({
      firstname: [this.local_data.firstname, Validators.required],
      lastname: [this.local_data.lastname, Validators.required],
      email: [this.local_data.email, [Validators.required, Validators.email]],
      adresse: [this.local_data.adresse, Validators.required],
      telephone: [this.local_data.telephone, Validators.required],
      telephone2: [this.local_data.telephone2],
      password: ['', [Validators.required]]

    });
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  getManagers(): void {
    this.adminService.getManagers().subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.dataSource.data = managers;
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  fetchData() {
    // Call your service to fetch the data
    this.adminService.getManagers().subscribe(data => {
      this.displayedData = data;
      this.dataSource = new MatTableDataSource(this.displayedData);
      //this.dataSource.sort = this.sort;
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
      this.adminService.addManager(this.managerForm.value).subscribe(
        
        (response) => {
          console.log(this.managerForm.value);
          console.log('Manager added:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          // Handle error
          console.error('Error adding manager:', error);
        }
      );
   
    } else if (this.action === 'Update') {
      // Handle Update action
      
        const updatedManager = this.managerForm.value;
        updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
        
        this.adminService.updateManager(updatedManager).subscribe(
          (response) => {
            console.log('Manager updated successfully', response);
            console.log('Manager updated:', response);
            this.dialogRef.close(true);             
          },
          (error) => {
            console.error('Error updating manager', error);
          }
        );
      
    } 
    else if (this.action === 'Block') {
      if (this.local_data.blocked) {
        // User is currently blocked, so we need to unblock
        this.adminService.unblockManager(this.local_data.id).subscribe(
          (response) => {
            if (response.success) {
              console.log('Manager unblocked successfully', response.message);
              this.dialogRef.close(true);
            } else {
              console.error('Error unblocking manager', response.error);
              this.dialogRef.close({ event: 'Error' });
            }
          },
          (error) => {
            console.error('Error unblocking manager', error);
            this.dialogRef.close({ event: 'Error' });
          }
        );
      } else {
        // User is not blocked, so we need to block
        this.adminService.blockManager(this.local_data.id).subscribe(
          (response) => {
            if (response.success) {
              console.log('Manager blocked successfully', response.message);
              this.dialogRef.close(true);             
            } else {
              console.error('Error blocking manager', response.error);
              this.dialogRef.close(true);             
            }
          },
          (error) => {
            console.error('Error blocking manager', error);
            this.dialogRef.close({ event: 'Error' });
          }
        );
      }
    }
  }
  

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}