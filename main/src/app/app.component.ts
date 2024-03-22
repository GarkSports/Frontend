import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private authService: AuthService) {
    const cookieValue = this.authService.getCookieValue();
    if(cookieValue){
    console.log('Cookie Value:', cookieValue);
    }
    else{
      console.error("error");
    }
  }
  title = 'Modernize Angular Admin Tempplate';
}
