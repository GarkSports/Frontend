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
import { Role,RoleArray  } from 'src/models/enums/role.model';
import { RoleName, RoleNameArray } from 'src/models/roleName.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-staff-list',
  templateUrl: './stafflist.component.html',
})
export class AppStafflistComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  totalCount = -1;
  Closed = -1;
  Inprogress = -1;
  Open = -1;

  displayedColumns: string[] = [
    'photo',
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
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  roleNames: string[] = [];


  constructor(public dialog: MatDialog,
              public datePipe: DatePipe,
              public managerService: ManagerService){}


  displayedData: any[] = [];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Manager>([]);
    this.fetchRoleNames();
    this.getManagers();
    //this.table.renderRows();
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

  fetchData() {
    // Call your service to fetch the data
    this.managerService.getManagers().subscribe(data => {
      this.displayedData = data;
      this.dataSource = new MatTableDataSource(this.displayedData);
      this.dataSource.sort = this.sort;
    });
  }

  fetchRoleNames(): void {
    this.managerService.getRoleNames().subscribe(roleNames => {
      //this.roleNames = roleNames;
      this.dataSource.paginator = this.paginator;

    });
  }

  ngAfterViewInit(): void {
    this.managerService.getManagers().subscribe(managers => {
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
    const dialogRef = this.dialog.open(AppStaffDialogContentComponent, {
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

  deleteRowData(deletedData: any) {
    this.displayedData = this.displayedData.filter(item => item.id !== deletedData.id);
  }
  // openUpdateDialog(paiement: Paiement): void {
  //   const dialogRef = this.dialog.open(PaiementDetailsPopupComponent, {
  //     data: paiement
  //   });

  //   dialogRef.afterClosed().subscribe(updatedPaiement => {
  //     if (updatedPaiement) {
  //       // Handle dialog result if needed
  //       this.getPaiements();
  //     }
  //   });
  // }

  // tslint:disable-next-line - Disables all
  addRowData(managerData: Manager): void {
    this.table.renderRows();
    // const d = new Date();
    // this.managerService.addStaff(managerData).subscribe(
    //   (response) => {
    //     console.log('Manager added successfully1', response);
    //     this.getManagers(); // Refresh the data after adding
    //     this.table.renderRows();
    //   },
    //   (error) => {
    //     console.error('Error adding Manager', error); // Handle error, if needed
    //   }
    // );
    //this.table.renderRows();
  }

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
  

  unblockRowData(managerData: Manager): void{
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
  photo: string;

  dataSource = new MatTableDataSource<string>([]);
  managerSource = new MatTableDataSource<Manager>([]);


  constructor(
    public dialogRef: MatDialogRef<AppStaffDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    private firestorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private managerService: ManagerService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action ;
    if (this.action === 'Update') {
      this.initManagerForm();
    }
  }

  showRoleInput: boolean = false;


  onRoleChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showRoleInput = selectedValue === 'STAFF' || selectedValue === 'ENTRAINEUR';
    this.sendRequestBasedOnRole(selectedValue);

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
      email: [this.local_data.email, [Validators.required, Validators.email]],
      adresse: [this.local_data.adresse, Validators.required],
      role: [this.local_data.role, Validators.required],
      roleName: this.local_data.role === 'ADHERENT' || 'PARENT' ? null : [this.local_data.roleName],
      photo: [null] 
      });

  }

  // fetchRoleNames(): void {
  //   this.managerService.getRoleNames().subscribe(roleNames => {
  //     this.roleNames = roleNames;
  //     console.log(roleNames);
  //   });
  // }

  getManagers(): void {
    this.managerService.getManagers().subscribe(
      (managers) => {
        console.log('Managers fetched successfully', managers);
        this.managerSource.data = managers;
        console.log("this.managerSource.data",this.managerSource.data);
        
      },
      (error) => {
        console.error('Error fetching academies', error);
      }
    );
  }

  fetchData() {
    // Call your service to fetch the data
    this.managerService.getManagers().subscribe(data => {
      this.displayedData = data;
      this.dataSource = new MatTableDataSource(this.displayedData);
      //this.dataSource.sort = this.sort;
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
      const role = this.managerForm.get('role')?.value;
      this.sendRequestBasedOnRole(role);
    }
  else if (this.action === 'Update') {
    // Handle Update action
    if (this.managerForm.valid) {
      const updatedManager = this.managerForm.value;
      updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
      var role = updatedManager.role;
      switch(role){
        case 'STAFF':
          if (this.managerForm.valid) {
          this.managerService.updateStaff(this.managerForm.value).subscribe(
            (response) => {
              console.log(this.managerForm.value); // Handle successful response
              console.log('Manager updated:', response);
              this.dialogRef.close(true);
            },
            (error) => {
              // Handle error
              console.error('Error adding manager:', error);
            }
          );
        } else {
          console.error('Form is not valid. Please fill out all required fields.');
        }
          break;
      case 'ENTRAINEUR':
        if (this.managerForm.valid) {
        this.managerService.updateEntraineur(this.managerForm.value).subscribe(
          (response) => {
            console.log(this.managerForm.value); // Handle successful response
            console.log('Manager added:', response);
            this.dialogRef.close(true);
          },
          (error) => {
            // Handle error
            console.error('Error adding manager:', error);
          }
        );
      } else {
        console.error('Form is not valid. Please fill out all required fields.');
      }
        break;
      case 'ADHERENT':
        if (this.managerForm.valid) {
        this.managerService.updateAdherent(this.managerForm.value).subscribe(
          (response) => {
            console.log(this.managerForm.value); // Handle successful response
            console.log('adherent added:', response);
            this.dialogRef.close(true);
          },
          (error) => {
            // Handle error
            console.error('Error adding manager:', error);
            // Also, log the error object
            console.log(error);
          }
        );
      } else {
        console.error('Form is not valid. Please fill out all required fields.');
      }
        break;
      case 'PARENT':
        if (this.managerForm.valid) {
        this.managerService.updateParent(this.managerForm.value).subscribe(
          (response) => {
            console.log(this.managerForm.value); // Handle successful response
            console.log('adherent added:', response);
            this.dialogRef.close(true);
          },
          (error) => {
            // Handle error
            console.error('Error adding manager:', error);
            // Also, log the error object
            console.log(error);
          }
        );
      } else {
        console.error('Form is not valid. Please fill out all required fields.');
      }
        break;
      default:
        break;
    
      } 
    }
  }
  if (this.action === 'Block') {
    const blockAction = this.local_data.blocked ? 'unBlockManager' : 'blockManager';
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
  }
   else {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
  
  sendRequestBasedOnRole(role: string) {
    switch (role) {
      case 'STAFF':
        if (this.managerForm.valid) {
        this.managerService.addStaff(this.managerForm.value).subscribe(
          (response) => {
            console.log(this.managerForm.value); // Handle successful response
            console.log('Manager added:', response);
            this.dialogRef.close(true);
          },
          (error) => {
            // Handle error
            console.error('Error adding manager:', error);
          }
        );
      } else {
        console.error('Form is not valid. Please fill out all required fields.');
      }
        break;
      case 'ENTRAINEUR':
        if (this.managerForm.valid) {
        this.managerService.addEntraineur(this.managerForm.value).subscribe(
          (response) => {
            console.log(this.managerForm.value); // Handle successful response
            console.log('Manager added:', response);
            this.dialogRef.close(true);
          },
          (error) => {
            // Handle error
            console.error('Error adding manager:', error);
          }          
        );
      } else {
        console.error('Form is not valid. Please fill out all required fields.');
      }
        break;
        case 'ADHERENT':
          if (this.managerForm.valid) {
            this.managerService.addAdherent(this.managerForm.value).subscribe(
              (response) => {
                console.log(this.managerForm.value); // Handle successful response
                console.log('adherent added:', response);
                this.dialogRef.close(true);
              },
              (error) => {
                // Handle error
                console.error('Error adding manager:', error);
              }
            );
          } else {
            console.error('Form is not valid. Please fill out all required fields.');
          }
          break;
        
      case 'PARENT':
        // this.getParentData();
        break;
      default:
        break;
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
    if(file){
      const path = `academie/${file.name}`;
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('Image URL:', url);
      this.local_data.photo = url;
      this.managerForm.patchValue({
        photo: url
      });
    }
  }
  

     
     
    
    // } else if (this.action === 'Delete') {
    //   // Handle Delete action
    //   this.managerService.deleteManager(this.local_data.id).subscribe(
    //     (response) => {
    //       console.log('Manager deleted successfully', response);
    //       this.dialogRef.close({ event: this.action, data: this.local_data.id });
    //     },
    //     (error) => {
    //       console.error('Error deleting manager', error);
    //       // i should display another dialogRef showing that the request wasn't successfull
    //       this.dialogRef.close({ event: this.action});
    //     }
    //   );
  
  

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
