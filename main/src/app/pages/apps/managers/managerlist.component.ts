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

// export interface ManagerElement {
//   id: number;
//   title: string;
//   subtext: string;
//   assignee: string;
//   imgSrc: string;
//   status: string;
//   date: string;
// }

// const managers: ManagerElement[] = [
//   {
//     id: 1,
//     title: 'Sed ut perspiciatis unde omnis iste',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     imgSrc: '/assets/images/profile/user-1.jpg',
//     assignee: 'Alice',
//     status: 'inprogress',
//     date: '2023-05-01',
//   },
//   {
//     id: 2,
//     title: 'Xtreme theme dropdown issue',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Jonathan',
//     imgSrc: '/assets/images/profile/user-2.jpg',
//     status: 'open',
//     date: '2023-05-03',
//   },
//   {
//     id: 3,
//     title: 'Header issue in material admin',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Smith',
//     imgSrc: '/assets/images/profile/user-3.jpg',
//     status: 'closed',
//     date: '2023-05-02',
//   },
//   {
//     id: 4,
//     title: 'Sidebar issue in Nice admin',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Vincent',
//     imgSrc: '/assets/images/profile/user-4.jpg',
//     status: 'inprogress',
//     date: '2023-05-06',
//   },
//   {
//     id: 5,
//     title: 'Elegant Theme Side Menu show OnClick',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Chris',
//     imgSrc: '/assets/images/profile/user-5.jpg',
//     status: 'open',
//     date: '2023-05-04',
//   },
//   {
//     id: 6,
//     title: 'Header issue in admin pro admin',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'James',
//     imgSrc: '/assets/images/profile/user-6.jpg',
//     status: 'closed',
//     date: '2023-05-03',
//   },
//   {
//     id: 7,
//     title: 'Elegant Theme Side Menu OnClick',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Jonathan',
//     imgSrc: '/assets/images/profile/user-7.jpg',
//     status: 'inprogress',
//     date: '2023-05-05',
//   },
//   {
//     id: 8,
//     title: 'adminpress Theme Side Menu not opening',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Smith',
//     imgSrc: '/assets/images/profile/user-8.jpg',
//     status: 'open',
//     date: '2023-05-04',
//   },
//   {
//     id: 9,
//     title: 'Charts not proper in xtreme admin',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Markus',
//     imgSrc: '/assets/images/profile/user-9.jpg',
//     status: 'closed',
//     date: '2023-05-02',
//   },
//   {
//     id: 10,
//     title: 'Psd not availabel with package',
//     subtext:
//       'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
//     assignee: 'Jane',
//     imgSrc: '/assets/images/profile/user-10.jpg',
//     status: 'closed',
//     date: '2023-05-03',
//   },
// ];

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
    'id',
    'title',
    'assignee',
    'status',
    'date',
    'action',
  ];
  dataSource = new MatTableDataSource<Manager>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  Object.create(null);


  constructor( 
    public dialog: MatDialog,
              public datePipe: DatePipe,
              public managerService: ManagerService){}

  ngOnInit(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.btnCategoryClick('Open');
    this.Closed = this.btnCategoryClick('Closed');
    this.Inprogress = this.btnCategoryClick('InProgress');
    this.dataSource = new MatTableDataSource<Manager>([]);
    
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
    const dialogRef = this.dialog.open(AppManagerDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data.managerData, result.data.academieId);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data.managerData);
      }
    });
  }
  // tslint:disable-next-line - Disables all
  addRowData(managerData: Manager, academieId: Academie): void {
    const d = new Date();
    this.managerService.addManager(managerData, academieId).subscribe(
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
    this.managerService.updateManager(managerData).subscribe(
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
  deleteRowData(managerData: Manager): void{
    this.managerService.archiveManager(managerData.id).subscribe(
      (response) => {
        console.log('Manager archived successfully', response);
        this.getManagers();
        this.dialogRef.close();

      },
      (error) => {
        console.error('Error archiving academie', error);
        // Handle error, if needed
      }
    );
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
}

 
@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'manager-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppManagerDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  managerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppManagerDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    private formBuilder: FormBuilder,
    private managerService: ManagerService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.action === 'Update') {
      this.initManagerForm();
    }
  }

  initManagerForm(): void {
    this.managerForm = this.formBuilder.group({
      // Add your form controls for the Manager data
      name: [this.local_data.name, Validators.required],
      // Add other form controls as needed
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
      // Handle Add action
      this.dialogRef.close({ event: this.action, data: this.local_data });
    } else if (this.action === 'Update') {
      // Handle Update action
      if (this.managerForm.valid) {
        const updatedManager = this.managerForm.value;
        updatedManager.id = this.local_data.id; // Set the id of the manager to be updated
        this.managerService.updateManager(updatedManager).subscribe(
          (response) => {
            console.log('Manager updated successfully', response);
            this.dialogRef.close({ event: this.action, data: updatedManager });
          },
          (error) => {
            console.error('Error updating manager', error);
          }
        );
      }
    } else if (this.action === 'Delete') {
      // Handle Delete action
      this.managerService.archiveManager(this.local_data.id).subscribe(
        (response) => {
          console.log('Manager archived successfully', response);
          this.dialogRef.close(); // Close the dialog without passing any data
        },
        (error) => {
          console.error('Error archiving manager', error);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
