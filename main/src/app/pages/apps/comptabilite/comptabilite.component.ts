import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComptabiliteService } from 'src/app/services/comptabilite.service';
import { Benefices, Depenses } from 'src/models/comptabilite.model';
import { Manager } from 'src/models/manager.model';

@Component({
  selector: 'app-comptabilite',
  templateUrl: './comptabilite.component.html',
  styleUrl: './comptabilite.component.scss'
})
export class AppComptabiliteComponent implements OnInit {

  beneficesList: Benefices[] = [];
  depensesList: Depenses[] = [];
  selectedSortingOption: string | null = null;
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' },
  ];
  selectedType: string | null = null;
  selectedEtat: string | null = null;

  constructor(private ComptabiliteService: ComptabiliteService) { }

  typeOptions: any;
  etatOptions: any;
  displayedColumns: string[] = [
    'Type',
    'Etat',
    'Quantite',
    'prix_unitaire',
    'total',
    'date',
  ];

  dataSource = new MatTableDataSource<Benefices>([]);
  
  ngOnInit(): void {
    this.loadBenefices();
  }

  loadBenefices(): void {
    this.ComptabiliteService.getAllBenefices().subscribe(
      data => {
        this.beneficesList = data;
      },
      error => {
        console.error('Error fetching benefices', error);
      }
    );
  }

  addBenefice(newBenefice: Benefices): void {
    this.ComptabiliteService.saveBenefice(newBenefice).subscribe(
      data => {
        this.beneficesList.push(data);
      },
      error => {
        console.error('Error saving benefice', error);
      }
    );
  }

  updateBenefice(updatedBenefice: Benefices,updateId: number): void {
    this.ComptabiliteService.updateBenefice(updateId, updatedBenefice).subscribe(
      data => {
        const index = this.beneficesList.findIndex(b => b.id === updatedBenefice.id);
        if (index !== -1) {
          this.beneficesList[index] = data;
        }
      },
      error => {
        console.error('Error updating benefice', error);
      }
    );
  }

  deleteBenefice(id: number): void {
    this.ComptabiliteService.deleteBenefice(id).subscribe(
      () => {
        this.beneficesList = this.beneficesList.filter(b => b.id !== id);
      },
      error => {
        console.error('Error deleting benefice', error);
      }
    );
  }



applyFilterByEtat() {
throw new Error('Method not implemented.');
}
applyFilterByType() {
throw new Error('Method not implemented.');
}






  applySorting() {
    if (this.selectedSortingOption === 'asc') {
      // this.dataSource.data.sort((a, b) => {
      //   const memberA = `${a.firstname} ${a.lastname}`.toLowerCase();
      //   const memberB = `${b.firstname} ${b.lastname}`.toLowerCase();
      //   return memberA.localeCompare(memberB);
      // });
    } else if (this.selectedSortingOption === 'desc') {
      // this.dataSource.data.sort((a, b) => {
      //   const memberA = `${a.firstname} ${a.lastname}`.toLowerCase();
      //   const memberB = `${b.firstname} ${b.lastname}`.toLowerCase();
      //   return memberB.localeCompare(memberA);
      // });
    }
    // After sorting, reassign the sorted data to the dataSource
    //this.dataSource = new MatTableDataSource<Manager>(this.dataSource.data);
  }

  resetFilters(): void {
    // Reset selected filters
    this.selectedType = null;
    this.selectedEtat = null;
    this.selectedSortingOption = '';

    // Apply filters again to refresh the data
    //this.applyFilter('');
  }
}
