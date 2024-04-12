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

@Component({
  selector: 'app-manager-list',
  templateUrl: './managerlist.component.html',
})
export class AppManagerlistComponent implements OnInit {
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
    'roleName',
    'telephone',   
    'equipe',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Manager>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  Object.create(null);


  constructor(public dialog: MatDialog,
              public datePipe: DatePipe,
              public adminService: AdminService){}

  ngOnInit(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.btnCategoryClick('Open');
    this.Closed = this.btnCategoryClick('Closed');
    this.Inprogress = this.btnCategoryClick('InProgress');
    this.dataSource = new MatTableDataSource<Manager>([]);
    
  }

  ngAfterViewInit(): void {
    this.adminService.getManagers().subscribe(managers => {
      this.dataSource.data = managers;
      this.dataSource.paginator = this.paginator;
      console.log(managers);
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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
        this.addRowData(result.data.managerData); // add the user in the page just display it 
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      } else if (result.event === 'Block'){
        this.blockRowData(result.data.managerData);
      }else if (result.event === 'UnBlock'){
        this.unblockRowData(result.data.managerData);
      }
    });
  }
  // tslint:disable-next-line - Disables all
  addRowData(managerData: Manager): void {
    const d = new Date();
    this.adminService.addManager(managerData).subscribe(
      (response) => {
        console.log('Manager added successfully', response);
        this.getManagers(); // Refresh the data after adding
      },
      (error) => {
        console.error('Error adding academie', error); // Handle error, if needed
      }
    );
    //this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(managerData: Manager): void {
    this.adminService.updateManager(managerData).subscribe(
    (response)=>{
      console.log('Manager updated successfully', response);
      this.getManagers();
    },
    (error)=> {
      console.error('Error archiving academie', error);
    }
   )
    
   
  }
 
  // tslint:disable-next-line - Disables all
  deleteRowData(managerData: Manager): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      return value.id !== managerData.id;
    });
  }
  
  blockRowData(managerData: Manager): void {
    this.adminService.blockManager(managerData.id).subscribe(
      (response) => {
        console.log('Manager blockManager successfully', response);
        this.getManagers(); // Reload the data after blocking
      },
      (error) => {
        console.error('Error archiving manager', error);
        // Handle error, if needed
      }
    );
  }
  

  unblockRowData(managerData: Manager): void{
    this.adminService.unBlockManager(managerData.id).subscribe(
      (response) => {
        console.log('Manager unblocked successfully', response);
        this.getManagers();
      },
      (error) => {
        console.error('Error unblocking academie', error);
        // Handle error, if needed
      }
    );
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

  ngOnInit(): void {
    this.initManagerForm();
  }

  initManagerForm(): void {
    this.managerForm = this.formBuilder.group({
      firstname: [this.local_data.firstname, Validators.required],
      lastname: [this.local_data.lastname, Validators.required],
      email: [this.local_data.email, [Validators.required, Validators.email]],
      adresse: [this.local_data.adresse, Validators.required],
      role: [this.local_data.role, Validators.required]
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
      this.adminService.addManager(this.managerForm.value).subscribe(
        
        (response) => {
          console.log(this.managerForm.value);

          // Handle successful response
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
      if (this.managerForm.valid) {
        const updatedManager = this.managerForm.value;
        updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
        this.adminService.updateManager(updatedManager).subscribe(
          (response) => {
            console.log('Manager updated 222 successfully', response);
            this.dialogRef.close({ event: this.action, data: updatedManager });
          },
          (error) => {
            console.error('Error updating manager', error);
          }
        );
      }
    } else if (this.action === 'Delete') {
      // Handle Delete action
      this.adminService.deleteManager(this.local_data.id).subscribe(
        (response) => {
          console.log('Manager deleted successfully', response);
          this.dialogRef.close({ event: this.action, data: this.local_data.id });
        },
        (error) => {
          console.error('Error deleting manager', error);
          // i should display another dialogRef showing that the request wasn't successfull
          this.dialogRef.close({ event: this.action});
        }
      );
    } 
    else if (this.action === 'Block') {
      this.managerService.blockManager(this.local_data.id).subscribe(
        (response) => {
          console.log('Manager blockManager successfully', response);
          this.dialogRef.close({ event: this.action, data: { managerData: this.local_data } });
        },
        (error) => {
          console.error('Error archiving manager', error);
          this.dialogRef.close({ event: this.action });
        }
      );
    } else {
      this.dialogRef.close({ event: 'Cancel' });
    }
  }
  

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
