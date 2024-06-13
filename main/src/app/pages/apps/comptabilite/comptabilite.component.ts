import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ComptabiliteService } from 'src/app/services/comptabilite.service';
import { Benefices, Depenses } from 'src/models/comptabilite.model';
import { PaiementService } from 'src/app/services/paiement.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
} from 'ng-apexcharts';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { Paiement } from 'src/models/paiement.model';
import { Adherent } from 'src/models/adherent.model';
import { StatutAdherent } from 'src/models/enums/statutAdherent.model';




export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-comptabilite',
  styleUrl: './comptabilite.component.scss',
  templateUrl: './comptabilite.component.html'
  
})
export class AppComptabiliteComponent implements OnInit {

  public currentyearChart: Partial<ChartOptions> | any;
  beneficesList: Benefices[] = [];
  depensesList: Depenses[] = [];
  selectedDate: Date;

  selectedSortingOption: string | null = null;
  sortingOptions = [
    { value: 'asc', viewValue: 'Ascendant' },
    { value: 'desc', viewValue: 'Descendant' },
  ];
  selectedType: string | null = null;
  selectedEtat: string | null = null;


  totalSumBenefices: number = 0;
  totalSumDepenses: number = 0;

  monthlySums: any = { currentMonthBenefices: 0, currentMonthDepenses: 0, currentMonthNet: 0 };
  monthlyComparisons: any;

  PaiementdataSource = new MatTableDataSource<Paiement>([]);
  paiementList: Paiement[] = [];


  @ViewChild('beneficePaginator') beneficePaginator: MatPaginator;
  @ViewChild('beneficeSort') beneficeSort: MatSort;

  BeneficesdataSource = new MatTableDataSource<Benefices>([]);
  
  @ViewChild('depensesPaginator') depensesPaginator: MatPaginator;
  @ViewChild('depenseSort') depenseSort: MatSort;
  DepensesdataSource = new MatTableDataSource<Depenses>([]);
  paiementnonPayeList: Paiement[];
  paiementnonPayeCount:number;
  paiementtotalCount: number;
  paiementquotient: number;



  constructor(
    private ComptabiliteService: ComptabiliteService,
    private router: Router,
    private paiementService: PaiementService,
    ) 
    {
      this.selectedDate = new Date(); 
    }

  typeOptions: any;
  etatOptions: any;

  NonPayeListdisplayedColumns: string[] = [
    'Type',
    'Etat',
    'Quantite',
    'prix_unitaire',
    'total',
    'action'
  ]
  

  BeneficesdisplayedColumns: string[] = [
    'Type',
    'Etat',
    'Quantite',
    'prix_unitaire',
    'total',
    'date',
    'action'
  ];

  DepensesdisplayedColumns: string[] = [
    'Type',
    'Etat',
    'Beneficiaire',
    'Quantite',
    'prix_unitaire',
    'total',
    'date',
    'action'
  ];





  
  ngOnInit(): void {
    this.loadBenefices();
    this.loadDepenses();
    this.getMonthlySums();
    this.getMonthlyComparisons();
    this.updateChart();
    this.getPaiements();

  }

  getPaiements(): void {
    this.paiementService.getPaiements().subscribe(paiements => {
      this.paiementList = paiements;
      this.PaiementdataSource.data = this.paiementList;
      this.calculateNonPayeQuotient();
    });
  }


  calculateNonPayeQuotient(): void {
   

    this.paiementnonPayeList = this.paiementList.filter(paiement => paiement.adherent!.statutAdherent.toString().toLowerCase() === 'non_payé');
    
    this.paiementnonPayeCount = this.paiementnonPayeList.length;
    // Filter out adherents with defined statutAdherent
    this.paiementtotalCount = this.paiementList.filter(paiement => paiement.adherent?.statutAdherent !== undefined).length;
  
    // Calculate quotient
    this.paiementquotient = this.paiementtotalCount > 0 ? (this.paiementnonPayeCount / this.paiementtotalCount) : 0;

  }
  

  updateChart(): void {
    var piedepenses: Number = 0;
    var piebenefices: Number = 0;
    var pienet:Number = 0;
    var customLegend:String[] = ['Benefices ', 'Depenses ','Benefices Net'];
    //this.monthlySums.currentMonthBenefices,this.monthlySums.currentMonthDepenses,

    if(this.monthlySums.currentMonthNet <= 0 ){
      piebenefices=this.monthlySums.currentMonthBenefices;
      piedepenses=this.monthlySums.currentMonthDepenses;
      pienet = 0;
      customLegend = ['Benefices ', 'Depenses '];
    } else if (this.monthlySums.currentMonthNet > 0 ){
      piebenefices=this.monthlySums.currentMonthBenefices - this.monthlySums.currentMonthNet;
      piedepenses=this.monthlySums.currentMonthDepenses;
      pienet = this.monthlySums.currentMonthNet;
      customLegend = ['Benefices ', 'Depenses ','Benefices Net'];
    }
    this.currentyearChart = {
      series: [piebenefices,piedepenses,pienet],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",

        toolbar: {
          show: false,
        },
      },

      colors: ['#B7EF3F', '#FF53C0', '#48DCE6'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '0%',
            background: 'transparent',


          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: true,
        customLegendItems:  customLegend,
        position: 'bottom',
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };


  }


  
  loadBenefices(): void {
    this.ComptabiliteService.getAllBenefices().subscribe(
      data => {
        this.beneficesList = data;
        this.BeneficesdataSource.data = this.beneficesList;
        this.BeneficesdataSource.paginator = this.beneficePaginator;
        this.calculateTotalSumbenefices();
        this.populateFilterOptions();

      },
      error => {
        console.error('Error fetching benefices', error);
      }
    );
  }

  calculateTotalSumbenefices(): void {
    this.totalSumBenefices = this.BeneficesdataSource.data.reduce((acc, curr) => acc + curr.total, 0);
  }

  loadDepenses(): void {
    this.ComptabiliteService.getAllDepenses().subscribe(
      data => {
        this.depensesList = data;
        this.DepensesdataSource.data = this.depensesList;
        this.DepensesdataSource.paginator = this.depensesPaginator;
        this.calculateTotalSumdepenses();
        this.populateFilterOptions();

      },
      error => {
        console.error('Error fetching depenses', error);
      }
    );
  }
  calculateTotalSumdepenses() {
    this.totalSumDepenses = this.DepensesdataSource.data.reduce((dep, deps) => dep + deps.total, 0);
  }

  navigateToAddPage(type: 'benefices' | 'depenses'): void {
    this.router.navigate(['apps/comptabilite/add/',type]);
  }

  navigateToUpdatePage(type: 'benefices' | 'depenses',id:String): void {
    this.router.navigate(['apps/comptabilite/update/',type ,id]);
  }



  deleteBenefice(id: number): void {
    this.ComptabiliteService.deleteBenefice(id).subscribe(
      () => {
      },
      error => {
        console.error('Error deleting benefice', error);
      }
    );
  }

  applyFilterByEtat(): void {
    const filterValue = this.selectedEtat ? this.selectedEtat.trim().toLowerCase() : '';
    this.BeneficesdataSource.filter = filterValue;
    this.DepensesdataSource.filter = filterValue;
  }


applyFilterByType(): void {
  const filterValue = this.selectedType ? this.selectedType.trim().toLowerCase() : '';
  this.BeneficesdataSource.filter = filterValue;
  this.DepensesdataSource.filter = filterValue;
}


populateFilterOptions(): void {
  const allTypes = new Set<string>();
  const allEtats = new Set<string>();

  this.beneficesList.forEach(benefice => {
    if (benefice.type) {
      allTypes.add(benefice.type);
    }
    if (benefice.etat) {
      allEtats.add(benefice.etat);
    }
  });

  this.depensesList.forEach(depense => {
    if (depense.type) {
      allTypes.add(depense.type);
    }
    if (depense.etat) {
      allEtats.add(depense.etat);
    }
  });

  this.typeOptions = Array.from(allTypes);
  this.etatOptions = Array.from(allEtats);
}

applyFilterByMonth(): void {
  if (this.selectedDate) {
    const selectedMonth = this.selectedDate.getMonth();
    const selectedYear = this.selectedDate.getFullYear();
    
    const filteredBenefices = this.beneficesList.filter(benefice => {
      const date = new Date(benefice.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
    
    const filteredDepenses = this.depensesList.filter(depense => {
      const date = new Date(depense.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
    
    this.BeneficesdataSource.data = filteredBenefices;
    this.DepensesdataSource.data = filteredDepenses;
  } else {
    this.BeneficesdataSource.data = this.beneficesList;
    this.DepensesdataSource.data = this.depensesList;
  }
}

  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    this.selectedDate = normalizedMonth;
    datepicker.close();
    this.applyFilterByMonth();
  }






  resetFilters(): void {
    this.selectedType = null;
    this.selectedEtat = null;
    this.selectedSortingOption = null;

    this.BeneficesdataSource.filter = '';
    this.DepensesdataSource.filter = '';
    this.applyFilterByMonth();
    this.BeneficesdataSource.data = this.beneficesList;
    this.DepensesdataSource.data = this.depensesList;
    
    
    
  }

  getMonthlySums(): void {
    this.ComptabiliteService.getmonthlysum().subscribe(
      data => {
        this.monthlySums = data;
        this.updateChart();
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  getMonthlyComparisons(): void {
    this.ComptabiliteService.getmonthlystat().subscribe(
      data => {
        this.monthlyComparisons = data;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  beneficesapplyFilter(filterValue: string): void {
    this.BeneficesdataSource.filter = filterValue.trim().toLowerCase();
  }

  depensessapplyFilter(filterValue: string): void {
    this.DepensesdataSource.filter = filterValue.trim().toLowerCase();
  }

  beneficesexportToPDF(): void {
    const doc = new jsPDF();

    // Define columns without the 'id' field
    const columns = [
        { title: 'Type', dataKey: 'type' },
        { title: 'État', dataKey: 'etat' },
        { title: 'Quantité', dataKey: 'quantite' },
        { title: 'Prix Unité', dataKey: 'prixunite' },
        { title: 'Total', dataKey: 'total' },
        { title: 'Date', dataKey: 'date' }
    ];



    // Map data to match the column titles
    const data = this.BeneficesdataSource.data.map((row: Benefices) => {
        const mappedRow: { [key: string]: any } = {};
        columns.forEach(col => {
            mappedRow[col.dataKey] = row[col.dataKey as keyof Benefices] ?? 'N/A';
        });
        return mappedRow;
    });

    // Generate the table and save the PDF
    (doc as any).autoTable({
        head: [columns.map(col => col.title)],
        body: data.map(row => columns.map(col => row[col.dataKey])),
    });

    doc.save('benefice-table.pdf');
}


  depensesexportToPDF(): void {
    const doc = new jsPDF();
    const columns = [
      { title: 'Type', dataKey: 'type' },
      { title: 'État', dataKey: 'etat' },
      { title: 'bénéficiaire', dataKey: 'beneficiaire' },
      { title: 'Quantité', dataKey: 'quantite' },
      { title: 'Prix Unité', dataKey: 'prixunite' },
      { title: 'Total', dataKey: 'total' },
      { title: 'Date', dataKey: 'date' }
  ];
    // Map data to match the column titles
    const data = this.DepensesdataSource.data.map((row: Depenses) => {
      const mappedRow: { [key: string]: any } = {};
      columns.forEach(col => {
          mappedRow[col.dataKey] = row[col.dataKey as keyof Depenses] ?? 'N/A';
      });
      return mappedRow;
  });

    (doc as any).autoTable(columns, data);
    doc.save('depenses-table.pdf');
  }
  
}
