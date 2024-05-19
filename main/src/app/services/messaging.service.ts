import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/app/pages/api/environment';

@Injectable({
    providedIn: 'root'
  })
export class MessagingService {

  messaging = getMessaging();
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.receiveMessage();
  }

  requestPermission() {
    getToken(this.messaging, { vapidKey: environment.firebaseConfig.vpaidKey }).then(
      (currentToken) => {
        if (currentToken) {
          console.log("you have token");
          console.log(currentToken);
        } else {
          console.log("problem token");
        }
      }
    );
  }

  receiveMessage() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      console.log('Message received. ', payload.notification);
      this.addNotification(payload.notification);
      
    });
  }

  private addNotification(notification: any) {
    const currentNotifications = this.notificationsSubject.getValue();
    if (currentNotifications.length >= 5) {
      currentNotifications.pop();
    }
    currentNotifications.unshift(notification);
    this.notificationsSubject.next(currentNotifications);
    console.log(' notificationsSubject. ',currentNotifications)
  }
}
