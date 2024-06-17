import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {Manager} from 'src/models/manager.model';
import {ManagerService} from 'src/app/services/manager.service';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {MatSort} from '@angular/material/sort';
import {PaiementService} from 'src/app/services/paiement.service';
import {Equipe} from 'src/models/equipe.model';
import {Router} from '@angular/router';
import { PhotoDialogComponent } from './staffform.component';
import { EquipeService } from 'src/app/services/equipe.service';
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-staff-list',
  templateUrl: './stafflist.component.html',
})
export class AppStafflistComponent implements OnInit, OnDestroy {
  private broadcastChannel: BroadcastChannel;

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

  dataSource = new MatTableDataSource<any>([]);
  statutOptions: string[] = ['true', 'false'];
  selectedEquipe: string | null = null;
  nomEquipeOptions: string[] = [];
  assignedEquipes: Equipe[] = [];
  equipeNoms: string[] = [];
  equipeSearch: Equipe[];
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
  showRoleInput: boolean = false;
  displayedData: any[] = [];
  error: string = '';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Manager,
    public datePipe: DatePipe,
    public managerService: ManagerService,
    private formBuilder: FormBuilder,
    private equipeService: EquipeService,
    private paiementService: PaiementService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.broadcastChannel = new BroadcastChannel('staffFormChannel');
    this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage.bind(this));
  }

  ngOnInit(): void {
    this.getManagersWithEquipes();
    // this.dataSource = new MatTableDataSource<any>([]);
    this.fetchRoleNames();
    //this.getManagers();
    
    this.getEquipeNames();
    
   // this.getRolesOptions();
  }


  getManagersWithEquipes(): void {
     this.managerService.getManagers().subscribe((managers)=> { 
      this.equipeService.getEquipes().subscribe((equipes)=>{
      const equipeNameByUserId = equipes.map(e=> ({
        nom: e.nom,
        users_id: [...(e.adherents?.map(a => a.id) ?? []), ...(e.entraineurs?.map(e => e.id) ?? [])] 
      }))
        const managers_with_equipe = managers.map((m) => ({
          ...m,
          equipes:  equipeNameByUserId.filter(item => item.users_id.includes(m.id)).map(i => i.nom) ?? []
        }))
        this.equipeSearch= equipes;
        setTimeout(()=>{
          
          this.dataSource.data =  managers_with_equipe;
          console.log("managers_with_equipe",this.dataSource.data); 
        },500)
       
      });
     });
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

  getAssignedEquipesForEntraineur(id: number): void {
    this.managerService.getEquipesByEntraineurId(id).subscribe(
      (assignedEquipes: Equipe[]) => {
        this.assignedEquipes = assignedEquipes;
        this.equipeNoms = assignedEquipes.map((equipe: Equipe) => equipe.nom);
        console.log('this.assignedEquipes', this.assignedEquipes);
        console.log('this.equipeNoms', this.equipeNoms);
        this.error = '';
      
  
      },
      (error) => {
        this.error = 'No equipes found or an error occurred';
      }
    );
  }

  getAssignedEquipesForAdherent(id: number): void {
    this.managerService.getEquipesByAdherentEmail(id).subscribe(
      (assignedEquipes: Equipe[]) => {
        this.assignedEquipes = assignedEquipes;
        this.equipeNoms = assignedEquipes.map((equipe: Equipe) => equipe.nom);
        console.log('this.assignedEquipes', this.assignedEquipes);
        console.log('this.equipeNoms', this.equipeNoms);
        this.error = '';

      },
      (error) => {
        this.error = 'No equipes found or an error occurred';
      }
    );
}

  getEquipeNames(): void {
    this.paiementService.getEquipes().subscribe((equipes: Equipe[]) => {
      this.nomEquipeOptions = equipes.map((equipe: Equipe) => equipe.nom);
    });
  }

  applyFilterByEquipe(): void {
    if (this.selectedEquipe !== null) {
      const filter = this.selectedEquipe.trim().toLowerCase();

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        // Check if Equipe matches the selected Equipe
        return this.matchesFilter(data.equipes, filter);
      };

      this.dataSource.filter = filter;
    } else {
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
      photo: [this.local_data.photo, Validators.required],
    });
  }

  openFormPage(action: string, obj: any): void {
    const queryParams = new URLSearchParams({
      action,
      id: obj.id
    }).toString();
    const url = `?${queryParams}`;
    window.location.href = url;
  }


  ngOnDestroy(): void {
    this.broadcastChannel.close();
  }

  handleBroadcastMessage(event: MessageEvent) {
    if (event.data === 'staffFormClosed') {
      this.getManagers();
    }
  }
  onRoleChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showRoleInput =
      selectedValue === 'STAFF' || selectedValue === 'ENTRAINEUR';
    // this.sendRequestBasedOnRole(selectedValue);
    console.log('selectedValue', selectedValue);
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppStaffDialogContentComponent, {
      data: { ...obj, managerForm: this.managerForm },
    });


    dialogRef.afterClosed().subscribe(() => {
      this.getManagers();
    });
  }

  openPhotoDialog(photo: string): void {
    const dialogRef = this.dialog.open(PhotoDialogComponent, {
      data: { photo },
      panelClass: 'photo-dialog-panel' // Optional: Add a custom class for additional styling
    });
  }

}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'staff-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppStaffDialogContentComponent {
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


  displayedData: any[] = [];


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
     if (this.action === 'Block') {
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


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
