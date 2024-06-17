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
import { EvenementService } from 'src/app/services/evenement.service';
import { Equipe } from 'src/models/equipe.model';
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
  selectedRole: string = '';
  selectedEquipe: Equipe | null = null;;
  filteredFriendsList: any[] = [];
  selectedFriends: any[] = [];
  allTeamMembersSelected: boolean = false;
  equipeList: Equipe[] = [];

  constructor(
    private managerService: ManagerService,
    public chatService: ChatService,
    private eventService: EvenementService,
    private router: Router,
    ) {
    this.local_data = {};
    this.getManager();
    this.getEquipes();
  }
  ngOnInit(): void {}

  getManager(): void {
    this.managerService.getManagers().subscribe(
      (managers) => {
        this.friendslist = managers;
        this.uniqueRoles = [...new Set(this.friendslist.map(friend => friend.role))];
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching managers', error);
      }
    );
  }

  getEquipes(): void {
    this.eventService.getEquipes().subscribe(equipes => {
        this.equipeList = equipes;
    });
}

  applyFilters(): void {
    this.filteredFriendsList = this.friendslist;

    if (this.selectedRole) {
      this.filteredFriendsList = this.filteredFriendsList.filter(friend => friend.role === this.selectedRole);
    }

    if (this.selectedRole === 'ADHERENT' && this.selectedEquipe) {
      this.filteredFriendsList = this.selectedEquipe.adherents ?? [];
    }
  }

  onRoleChange(): void {
    this.selectedEquipe = null;
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
    if (this.selectedEquipe?.adherents) {
      if (this.allTeamMembersSelected) {
        // Deselect all team members
        this.selectedFriends = this.selectedFriends.filter(
          friend => !this.selectedEquipe!.adherents!.includes(friend)
        );
      } else {
        // Select all team members
        this.selectedEquipe.adherents.forEach(adherent => {
          if (!this.isSelected(adherent)) {
            this.selectedFriends.push(adherent);
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
          this.closeDialog();
      
          
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

  resetFilters(): void {
    this.selectedRole = '';
    this.selectedEquipe = null;
    this.applyFilters();
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
    //this.closeDialog();
  }

  closeDialog(): void {
    // Handle closing the "dialog" which in this case might mean navigating away
    console.log("Dialog closed");
    this.router.navigate(['apps/chat']);
  }
}


