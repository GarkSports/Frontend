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
    this.selectedMessage = this.messages[0];
    

  }
  ngOnInit(): void {
    
    try {   
      console.log('ngOnInit');
       this.chatService.fetchContactList().subscribe((c: ChatContactDTO[]) => (this.chatService.contactList = c));

    }
    finally{
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
    console.log('eeeeeeeeeeeee',message)
    this.selectedMessage = message;
    this.chatService.getDiscussion(message).subscribe((d: ChatDTO[]) => (this.chatService.discussionList = d))

      console.log('this.selectedMessage',this.chatService.discussionList);
      this.selectedDiscussion=this.chatService.discussionList;
      this.selectedContact=message;
   
  

  }

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;

    if (this.msg !== '') {
      console.log('sending messager')
      this.chatService.sendMessage(this.selectedContact, this.msg).subscribe(
        () => {
          console.log('Message sent successfully');
          try {
            this.chatService.getDiscussion(this.selectedContact).subscribe((d: ChatDTO[]) => (this.chatService.discussionList = d));
          } finally {
            console.log('this.selectedMessage',this.chatService.discussionList);
          this.selectedDiscussion=this.chatService.discussionList;
          }
          
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
