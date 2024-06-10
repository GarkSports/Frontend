// app-chat.component.ts
import { Component, ViewChild, ElementRef, OnInit, Inject, Optional ,OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ChatContactDTO, ChatDTO } from 'src/models/chat.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class AppChatComponent implements OnInit, OnDestroy {
  sidePanelOpened = true;
  msg = '';
  local_data: any;
  userRole: string = '';

  // MESSAGE
  selectedMessage: any;
  selectedDiscussion: ChatDTO[];
  selectedContact: ChatContactDTO;
  public messages: Array<any> = [];
  
  private routerSubscription: Subscription;

  constructor(
    public chatService: ChatService,
    private router: Router,
    private managerService: ManagerService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/apps/chat') {
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadData(): void {
    try {
      console.log('loadData');
      this.chatService.fetchContactList().subscribe((c: ChatContactDTO[]) => {
        this.chatService.contactList = c;
        this.getManagerProfil();
        
        if (this.chatService.contactList.length > 0) {
          const firstDiscussionId = this.chatService.contactList[0];
          this.onSelect(firstDiscussionId);
        }
      });
    } finally {
      console.log('loadData OK');
    }
  }

  getManagerProfil(): void {
    this.managerService.getProfil().subscribe(
      profil => {
        this.local_data = profil;
        this.userRole = this.local_data.role;
      },
      error => {
        console.error('Error fetching profil', error);
      }
    );
  }

  @ViewChild('chatContainer', { static: false }) chatContainer: ElementRef;
  @ViewChild('myInput', { static: true }) myInput: ElementRef = Object.create(null);

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(contact: ChatContactDTO): void {
    console.log('Selected contact', contact);
    this.selectedMessage = contact.username;

    this.chatService.getDiscussion(contact.userId).subscribe((d: ChatDTO[]) => {
      this.chatService.discussionList = d;
      this.selectedDiscussion = this.chatService.discussionList;
      this.selectedContact = contact;
      console.log('Selected discussion', this.selectedDiscussion);
    });
  }

  openDialog(action: string, obj: any): void {
    if (this.userRole == 'ADMIN') {
      this.router.navigate(['apps/adminnewmessage'], { state: { data: obj } });
    } else if (this.userRole == 'MANAGER') {
      this.router.navigate(['apps/newmessage'], { state: { data: obj } });
    }
  }

  addRowData(data: any): void {
    this.sendMessage(data.receiver, data.msg);
  }

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;
    this.sendMessage([this.selectedContact.userId], this.msg);
    this.myInput.nativeElement.value = '';
  }

  private sendMessage(receiversId: number[], message: string): void {
    if (message !== '') {
      console.log('Sending message', message);
      this.chatService.sendMessage(receiversId, message).subscribe(
        () => {
          console.log('Message sent successfully');
          this.refreshDiscussion(receiversId[0]);
          this.loadData();
        },
        error => {
          console.error('Error occurred while sending message:', error);
        }
      );
    }
  }

  private refreshDiscussion(userId: number): void {
    this.chatService.getDiscussion(userId).subscribe((d: ChatDTO[]) => {
      this.chatService.discussionList = d;
      this.selectedDiscussion = this.chatService.discussionList;
      console.log('Updated discussion', this.selectedDiscussion);
    });
  }

  deleteDiscussion(): void {
    this.chatService.deleteDiscussion(this.selectedContact.userId).subscribe(
      () => {
        console.log('Discussion deleted successfully');
        this.loadData();
      },
      error => {
        console.log('Discussion deletion failed');
      }
    );
  }
}


@Component({
  selector: 'app-dialog-content',
  templateUrl: 'chat-dialog-content.html',
})
export class AppChatDialogContentComponent {
  action: string;
  local_data: any;
  friendslist: any[] = [];
  uniqueRoles: string[] = [];
  uniqueNomEquipes: string[] = [];
  selectedRole: string = '';
  selectedNomEquipe: string = '';
  filteredFriendsList: any[] = [];
  selectedFriends: any[] = [];
  allTeamMembersSelected: boolean = false;

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
        this.friendslist = managers;
        this.uniqueRoles = [...new Set(this.friendslist.map(friend => friend.role))];
        this.uniqueNomEquipes = [...new Set(this.friendslist.map(friend => friend.nomEquipe))];
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching managers', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredFriendsList = this.friendslist;

    if (this.selectedRole) {
      this.filteredFriendsList = this.filteredFriendsList.filter(friend => friend.role === this.selectedRole);
    }

    if (this.selectedRole === 'ADHERENT' && this.selectedNomEquipe) {
      this.filteredFriendsList = this.filteredFriendsList.filter(friend => friend.nomEquipe === this.selectedNomEquipe);
    }
  }

  onRoleChange(): void {
    this.selectedNomEquipe = ''; // Reset the nomEquipe filter when role changes
    this.applyFilters();
  }

  onNomEquipeChange(): void {
    this.applyFilters();
  }

  isSelected(friend: any): boolean {
    return this.selectedFriends.some(selected => selected.id === friend.id);
  }

  toggleSelection(friend: any): void {
    const index = this.selectedFriends.findIndex(selected => selected.id === friend.id);
    if (index === -1) {
      this.selectedFriends.push(friend);
    } else {
      this.selectedFriends.splice(index, 1);
    }
    this.local_data.receiver = this.selectedFriends.map(friend => friend.id);
    console.log("zzzz",this.local_data.receiver);
  }

  getSelectedFriends(): any[] {
    return this.selectedFriends;
  }

  selectAllTeamMembers(): void {
    if (this.selectedNomEquipe) {
      if (this.allTeamMembersSelected) {
        // Deselect all team members
        this.filteredFriendsList.forEach(friend => {
          if (friend.nomEquipe === this.selectedNomEquipe) {
            const index = this.selectedFriends.findIndex(selected => selected.id === friend.id);
            if (index !== -1) {
              this.selectedFriends.splice(index, 1);
            }
          }
        });
      } else {
        // Select all team members
        this.filteredFriendsList.forEach(friend => {
          if (friend.nomEquipe === this.selectedNomEquipe && !this.isSelected(friend)) {
            this.selectedFriends.push(friend);
          }
        });
      }
      // Update the flag
      this.allTeamMembersSelected = !this.allTeamMembersSelected;
      // Update the local_data.receiver with the IDs of all selected friends
      this.local_data.receiver = this.selectedFriends.map(friend => friend.id);
    }
  }

  doAction(): void {
    if (this.selectedFriends.length > 0) {
      const firstGroupId = this.selectedFriends[0].groupid;
      const allSameGroup = this.selectedFriends.every(friend => friend.groupid === firstGroupId);
      
      if (allSameGroup) {
        this.local_data.groupid = firstGroupId;
      } else {
        this.local_data.groupid = null; // or handle the mismatch case as needed
      }
    } else {
      this.local_data.groupid = null;
    }

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
