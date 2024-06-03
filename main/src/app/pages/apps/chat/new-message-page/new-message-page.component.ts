import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager.service';
import { ChatContactDTO } from 'src/models/chat.model';
import { Router } from '@angular/router';


import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat.service';
@Component({
  selector: 'app-new-message-page',
  templateUrl: './new-message-page.component.html',
  styleUrl: './new-message-page.component.scss'
})
export class NewMessagePageComponent implements OnInit{
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
    private managerService: ManagerService,
    public chatService: ChatService,
    private router: Router,
    ) {
    this.local_data = {};
    this.getManager();
  }
  ngOnInit(): void {}

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
    console.log("zzzz", this.local_data.receiver);
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
    // Perform the desired action with the updated local_data
    console.log("Action performed with data:", this.local_data);
    this.addRowData(this.local_data);
    this.closeDialog();
  }

  closeDialog(): void {
    // Handle closing the "dialog" which in this case might mean navigating away
    console.log("Dialog closed");
    this.router.navigate(['apps/chat']);
  }
}


