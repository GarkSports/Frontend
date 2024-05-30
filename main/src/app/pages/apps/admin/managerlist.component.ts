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
import { ActivatedRoute, Router } from '@angular/router';

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
  profil: Manager | null = null;
  action: string;
  local_data: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);


  constructor(public dialog: MatDialog,
              public datePipe: DatePipe,
              public adminService: AdminService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
              public academieService: AcademieService,
              private route: ActivatedRoute,
              private router: Router
              ){
                this.local_data = { ...data };
    this.action = this.local_data.action;
              }

  displayedData: any[] = [];
  //sortOrder: string = 'asc'; // default sorting order

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Manager>([]);

    this.route.queryParams.subscribe(params => {
      this.dataSource = new MatTableDataSource<Manager>([]);

      this.action = params['action'];
      this.local_data = { ...params };
      this.getAcademiesNames();
      this.fetchData();
      this.getManagers();
    });
  }


  onUpdate(manager: Manager) {
    this.router.navigate(['/managerForm', manager.id]);
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


matchesFilter(value: any, filter: string): boolean {
  // Convert value to string if it's not already
  const stringValue = value ? value.toString().toLowerCase() : '';
  // Check if the string value contains the filter value
  return stringValue.includes(filter);
}

getAcademiesNames(): void {
  this.academieService.getAcademies().subscribe((academies: Academie[]) => {
    this.academieOptions = academies.map((academie: Academie) => academie.nom);
    console.log("academie.nom",this.academieOptions);
    
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
      (profil: Manager[]) => {
        console.log('Profile fetched successfully', profil);
        this.dataSource.data = profil;
      },
      (error) => {
        console.error('Error fetching profile', error);
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

  openFormPage(action: string, obj: any): void {
    const queryParams = new URLSearchParams({
      action,
      id: obj.id
    }).toString();
    const url = `/apps/managerForm?${queryParams}`;
    window.location.href = url;
  }
  
  


  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppManagerDialogContentComponent, {
      data: obj
    });

    //here we will just reload or display the changes instantly but the real work will be in the dialog
    dialogRef.afterClosed().subscribe(() => {
      
      this.getManagers();

    });
  }

}

 
@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'manager-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppManagerDialogContentComponent {
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
  
  }
  displayedData: any[] = [];



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
    if (this.action === 'Block') {
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
    else if (this.action === 'Delete') {
        // User is currently blocked, so we need to unblock
        this.adminService.deleteManager(this.local_data.id).subscribe(
          (response) => {
            if (response.success) {
              console.log('Manager deleting successfully', response.message);
              this.dialogRef.close(true);
            } else {
              console.error('Error deleting manager', response.error);
              this.dialogRef.close(true);             
            }
          },
          (error) => {
            console.error('Error deleting manager', error);
            this.dialogRef.close({ event: 'Error' });
          }
        );
    }
      
  }
  

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}