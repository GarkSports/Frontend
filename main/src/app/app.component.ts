import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError } from 'rxjs/operators';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{

  title = 'Modernize Angular Admin Tempplate';

  constructor(private messagingService: MessagingService){}

  ngOnInit(): void {
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    

    }
}
