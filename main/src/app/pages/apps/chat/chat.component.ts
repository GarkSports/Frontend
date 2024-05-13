import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { messages } from './chat-data';
import { ChatService } from 'src/app/services/chat.service';
import { ChatContactDTO, ChatDTO } from 'src/models/chat.model';


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
  selectedDiscussion: any;
  selectedContact: number;


  public messages: Array<any> = messages;
  // tslint:disable-next-line - Disables all
  // messages: Object[] = messages;

  constructor(
    public chatService: ChatService,
  ) {

  }
  ngOnInit(): void {
    try {   
      console.log('ngOnInit');
      this.chatService.fetchContactList().subscribe((c: ChatContactDTO[]) => {
        this.chatService.contactList = c;
        
        // If there are discussions available, select the first one
        if (this.chatService.contactList.length > 0) {
          const firstDiscussionId = this.chatService.contactList[0].userId;
          this.onSelect(firstDiscussionId);
        }
      });
    }
    finally {
      console.log('ngOnInit OK');
    }
  }
  

  

  @ViewChild('myInput', { static: true }) myInput: ElementRef =
    Object.create(null);

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  // tslint:disable-next-line - Disables all
  onSelect(message: number): void {
    console.log('eeeeeeeeeeeee', message);
  this.selectedMessage = message;
  
  // Call the service method to get the discussion
  this.chatService.getDiscussion(message).subscribe((d: ChatDTO[]) => {
    // Update the discussion list in the service
    this.chatService.discussionList = d;
    
    // Assign the discussion list to selectedDiscussion
    this.selectedDiscussion = this.chatService.discussionList;
    this.selectedContact = message;
    
    // Log the discussion list (optional)
    console.log('this.selectedMessage', this.selectedDiscussion);
  });
  

  }

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;
  
    if (this.msg !== '') {
      console.log('sending message');
      this.chatService.sendMessage(this.selectedContact, this.msg).subscribe(
        () => {
          console.log('Message sent successfully');
          // Refresh the discussion after sending the message
          this.chatService.getDiscussion(this.selectedContact).subscribe((d: ChatDTO[]) => {
            // Update the discussion list in the service
            this.chatService.discussionList = d;
            
            // Assign the discussion list to selectedDiscussion
            this.selectedDiscussion = this.chatService.discussionList;
            
            // Log the discussion list (optional)
            console.log('this.selectedMessage', this.selectedDiscussion);
          });
        },
        (error) => {
          console.error('Error occurred while sending message:', error);
          // Handle error if needed
        }
      );
    }
  
    this.myInput.nativeElement.value = '';
  }
  
}
