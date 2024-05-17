import { Component, ViewChild, ElementRef, OnInit, Inject, Optional } from '@angular/core';
import { messages } from './chat-data';
import { ChatService } from 'src/app/services/chat.service';
import { ChatContactDTO, ChatDTO } from 'src/models/chat.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})


export class AppChatComponent implements OnInit {
  sidePanelOpened = true;
  msg = '';

  // MESSAGE
  selectedMessage: any;
  selectedDiscussion: ChatDTO[];
  selectedContact: ChatContactDTO;


  public messages: Array<any> = messages;
  // tslint:disable-next-line - Disables all
  // messages: Object[] = messages;

  constructor(
    public chatService: ChatService,
    public dialog: MatDialog,
  ) {

  }
  ngOnInit(): void {
    try {   
      console.log('ngOnInit');
      this.chatService.fetchContactList().subscribe((c: ChatContactDTO[]) => {
        this.chatService.contactList = c;
        
        // If there are discussions available, select the first one
        if (this.chatService.contactList.length > 0) {
          const firstDiscussionId = this.chatService.contactList[0];
          this.onSelect(firstDiscussionId);
        }
      });
    }
    finally {
      console.log('ngOnInit OK');
    }
  }
  @ViewChild('chatContainer', { static: false }) chatContainer: ElementRef;

  

  @ViewChild('myInput', { static: true }) myInput: ElementRef =
    Object.create(null);

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  // tslint:disable-next-line - Disables all
  onSelect(contact: ChatContactDTO): void {
    console.log('eeeeeeeeeeeee', contact);
  this.selectedMessage = contact.username;
  
  // Call the service method to get the discussion
  this.chatService.getDiscussion(contact.userId).subscribe((d: ChatDTO[]) => {
    // Update the discussion list in the service
    this.chatService.discussionList = d;
    
    // Assign the discussion list to selectedDiscussion
    this.selectedDiscussion = this.chatService.discussionList;
    this.selectedContact = contact;
    
    // Log the discussion list (optional)
    console.log('this.selectedMessage', this.selectedDiscussion);
  });
  

  }

  // applyFilter(filterValue: string): void {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppChatDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Ajouter') {
        this.addRowData(result.data);
      } 
    });
  }
  addRowData(data: any) {
    
    this.sendMessage(data.receiver, data.msg);
    
  }

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;
  
    this.sendMessage(this.selectedContact.userId, this.msg);
  
    this.myInput.nativeElement.value = '';
  
  }

  private sendMessage(userId: number, message: string): void {
    if (message !== '') {
      console.log('sending message');
      this.chatService.sendMessage(userId, message).subscribe(
        () => {
          console.log('Message sent successfully');
          // Refresh the discussion after sending the message
          this.chatService.getDiscussion(userId).subscribe((d: ChatDTO[]) => {
            // Update the discussion list in the service
            this.chatService.discussionList = d;
            
            // Assign the discussion list to selectedDiscussion
            this.selectedDiscussion = this.chatService.discussionList;
            
            // Log the discussion list (optional)
            console.log('this.selectedMessage', this.selectedDiscussion);
            this.ngOnInit();
          });
        },
        (error) => {
          console.error('Error occurred while sending message:', error);
          // Handle error if needed
        }
      );
    }
  }
}

@Component({
    selector: 'app-dialog-content',
    templateUrl: 'chat-dialog-content.html',
    
})
  export class AppChatDialogContentComponent {
    action: string;
    // tslint:disable-next-line - Disables all
    local_data: any;
    msg = '';

   
    friendslist: any[] = [];

    constructor(
      public dialogRef: MatDialogRef<AppChatDialogContentComponent>,
      private managerService: ManagerService,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: ChatContactDTO
    ) {
      this.local_data = { ...data };
      this.action = this.local_data.action;
      this.getManager();
  
    }

    getManager(): void {
      this.managerService.getManagers().subscribe(
        (managers) => {
          console.log('Managers fetched successfully', managers);
          this.friendslist = managers;
          console.log('this.friendslist.data fetched successfully', this.friendslist);
        },
        (error) => {
          console.error('Error fetching academies', error);
        }
      );
    }

    doAction(): void {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  
    closeDialog(): void {
      this.dialogRef.close({ event: 'Cancel' });
    }

  }

