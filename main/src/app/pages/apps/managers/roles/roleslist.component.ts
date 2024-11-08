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
import { Roles } from 'src/models/roles.model';
import { RoleName } from 'src/models/roleName.models';



@Component({
  selector: 'app-roles-list',
  templateUrl: './roleslist.component.html',
})
export class AppRoleslistComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  roleNames: RoleName[];

  displayedColumns: string[] = ['roleName', 'permissions', 'action'];
 // displayedColumns: string[] = ['action', 'permissions', 'roleName'];
  dataSource = new MatTableDataSource<RoleName>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  Object.create(null);
  //roleNames: string[];


  constructor(public dialog: MatDialog,
              public datePipe: DatePipe,
              public managerService: ManagerService){}

  ngOnInit(): void {

    this.fetchRoleNames();
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

    // Split the filter value into individual words
    const filterWords = filter.split(' ');

    // Set filter function for data source
    this.dataSource.filterPredicate = (data: RoleName, filter: string) => {
      // Check if any attribute matches all the filter words
      return filterWords.every(word =>
        this.matchesFilter(data.name, word) 
      );
    };

    this.dataSource.filter = filter;
  }


  fetchRoleNames(): void {
    this.managerService.getRoleNames().subscribe(roleNames => {
      this.dataSource.data = roleNames;
      console.log(roleNames);
    });
  }

 
  // ngAfterViewInit(): void {
  //   this.managerService.getRoleNames().subscribe(roleNames => {
  //     this.dataSource.data = roleNames;
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }
  

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppRolesDialogContentComponent, {
      data: obj
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchRoleNames();
    });
  }
}

 
@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'roles-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppRolesDialogContentComponent implements OnInit {
  action: string;
  local_data: any;
  rolesForm: FormGroup;
  firstnameValue: string;
  roleNames: string[] = [];
  permissions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AppRolesDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RoleName,
    private formBuilder: FormBuilder,
    private managerService: ManagerService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action ;
    if (this.action === 'Update') {
      this.initRolesForm();
    }
  }

  ngOnInit(): void {
    this.initRolesForm();
    this.fetchRoleNames();
    this.fetchPermissions();
  }

 


  initRolesForm(): void {
    this.rolesForm = this.formBuilder.group({
      name: [this.local_data.name, Validators.required],
      permissions: [this.local_data.permissions, Validators.required],
    });
  }

  fetchRoleNames(): void {
    this.managerService.getRoleNames().subscribe(roleNames => {
      //this.roleNames = roleNames;
      console.log(roleNames);
      
    });
  }



  fetchPermissions(): void {
    this.managerService.getPermissions().subscribe(permissions => {
      this.permissions = permissions;
      console.log(permissions);
      
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
     
      const name = this.rolesForm.get('name')?.value; // Add '?' for null check
      const permissions = this.rolesForm.get('permissions')?.value; // Add '?' for null check
  
      this.managerService.addRoleName(name, permissions).subscribe(
        (response) => {
          console.log('Role name added:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(this.rolesForm.value);
          // Handle error
          console.error('Error adding role name:', error);
        }
      );
    
  }
     else if (this.action === 'Update' && this.rolesForm) {
      // Handle Update action
        const updatedRolename = this.rolesForm.value;

        updatedRolename.id = this.local_data.id; // Set the id of the manager to be updated
        this.managerService.updateRolename(updatedRolename).subscribe(
          (response) => {
            console.log('rolename updated successfully', response);
            this.fetchRoleNames();
            this.dialogRef.close({ event: this.action, data: updatedRolename });
            
          },
          (error) => {
            console.error('Error updating rolename', error);
          }
          
        );
      
    } else if (this.action === 'Delete') {
      // Handle Delete action
      this.managerService.deleteRolename(this.local_data.id).subscribe(
        response => {
          if (response.success) {
            console.log(response.message);
            this.dialogRef.close({ event: true });
            this.fetchRoleNames();
          } else {
            console.error(response.error);
            this.dialogRef.close({ event: true });
            this.fetchRoleNames();
          }
          this.fetchRoleNames();
        },
        error => {
          console.error('Error deleting rolename', error);
          this.dialogRef.close({ event: true });
          this.fetchRoleNames();
        }
        
      );
    }
     else {
      this.dialogRef.close({ event: 'Cancel' });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
