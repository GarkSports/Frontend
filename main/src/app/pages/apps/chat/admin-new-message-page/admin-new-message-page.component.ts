import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from 'src/app/services/chat.service';
import { AdminService } from 'src/app/services/admin.service';
import { Manager } from 'src/models/manager.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'admin-app-new-message-page',
  templateUrl: './admin-new-message-page.component.html',
  styleUrl: './admin-new-message-page.component.scss'
})
export class AdminNewMessagePageComponent implements OnInit, AfterViewInit {
  action: string;
  local_data: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  selection = new SelectionModel<Manager>(true, []);
  dataSource = new MatTableDataSource<Manager>([]);
  initialSelection = [];
  allowMultiSelect = true;

  constructor(
    private adminService: AdminService,
    public chatService: ChatService,
    private router: Router
  ) {
    this.local_data = {};
    this.selection = new SelectionModel<Manager>(this.allowMultiSelect, this.initialSelection);
  }

  displayedColumns: string[] = [
    'select',
    'firstname',
    'telephone',
    'academie',
    'adresse',
    'status',
  ];

  ngOnInit(): void {
    // this.getManagers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getManagers();
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  private sendMessage(receiversId: number[], message: string): void {
    if (message !== '') {
      console.log('Sending message', message);
      this.chatService.sendMessage(receiversId, message).subscribe(
        () => {
          console.log('Message sent successfully');
        },
        (error) => {
          console.error('Error occurred while sending message:', error);
        }
      );
    }
  }

  addRowData(data: any): void {
    this.sendMessage(data.receiver, data.msg);
  }

  doAction(): void {
    const selectedIds = this.selection.selected.map(manager => manager.id);
    this.local_data.receiver = selectedIds;
    console.log('Selected IDs:', selectedIds);

    this.addRowData(this.local_data);
    this.closeDialog();
  }

  closeDialog(): void {
    // Handle closing the "dialog" which in this case might mean navigating away
    console.log("Dialog closed");
    this.router.navigate(['apps/chat']);
  }
}
