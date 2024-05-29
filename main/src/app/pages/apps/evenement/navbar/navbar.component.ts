import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
  isListEvenementActive: boolean = false;
  isCalendrierActive: boolean = false;
  isEntrainementActive: boolean = false;

  constructor(private router: Router) {
    // Check the initial route on component initialization
    this.checkActiveRoute();
  }

  checkActiveRoute() {
    const currentRoute = this.router.url;
    this.isListEvenementActive = currentRoute.includes('/apps/listevenement');
    this.isCalendrierActive = currentRoute.includes('/apps/calendrier');
    this.isEntrainementActive = currentRoute.includes('/apps/entrainement');
  }

  setActive(tab: string) {
    if (tab === 'listevenement') {
      this.router.navigateByUrl('/apps/listevenement');
    } else if (tab === 'calendrier') {
      this.router.navigateByUrl('/apps/calendrier');
    }
    else if (tab === 'entrainement') {
      this.router.navigateByUrl('/apps/entrainement');
    }
  }
}
