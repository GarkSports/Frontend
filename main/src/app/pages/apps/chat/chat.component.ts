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
  selectedDiscussion: ChatDTO[];
  selectedContact: ChatContactDTO;


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

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;
  
    if (this.msg !== '') {
      console.log('sending message');
      this.chatService.sendMessage(this.selectedContact.userId, this.msg).subscribe(
        () => {
          console.log('Message sent successfully');
          // Refresh the discussion after sending the message
          this.chatService.getDiscussion(this.selectedContact.userId).subscribe((d: ChatDTO[]) => {
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
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  
}
