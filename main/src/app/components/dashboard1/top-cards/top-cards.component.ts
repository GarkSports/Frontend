import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { DashboardService } from 'src/app/services/dashboard.service';

interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      img: '/assets/images/dashboardIcons/icons8-school-building-48.png',
      title: 'Academies',
      subtitle: '',
    },
    {
      id: 2,
      color: 'warning',
      img: '/assets/images/dashboardIcons/icons8-sport-64.png',
      title: 'Disciplines',
      subtitle: '',
    },
    {
      id: 3,
      color: 'accent',
      img: '/assets/images/dashboardIcons/icons8-manager-48.png',
      title: 'Managers',
      subtitle: '',
    },
    {
      id: 4,
      color: 'error',
      img: '/assets/images/dashboardIcons/icons8-users-48.png',
      title: 'Adherents',
      subtitle: '',
    },
    {
      id: 5,
      color: 'success',
      img: '/assets/images/dashboardIcons/icons8-coach-48.png',
      title: 'Entraineurs',
      subtitle: '',
    },
    {
      id: 6,
      color: 'accent',
      img: '/assets/images/dashboardIcons/icons8-events-58.png',
      title: 'Events',
      subtitle: '',
    },
  ];

  constructor(private dashboardService : DashboardService) {}

  ngOnInit(): void {
    this.updateAcademiesCount();
    this.updateDisciplinesCount();
    this.updateManagersCount();
    this.updateAdherentsCount();
    this.updateEntraineursCount();
    this.updateEvenementsCount();
  }

  updateAcademiesCount(): void {
    this.dashboardService.countAcademies().subscribe(
      (count) => {
        // Find the academy top card and update its subtitle with the count
        const academyTopCard = this.topcards.find(card => card.title === 'Academies');
        if (academyTopCard) {
          academyTopCard.subtitle = count.toString();
        }
      },
      (error) => {
        console.error('Error fetching academies count:', error);
        // Handle error, display error message, etc.
      }
    );
  }

  updateDisciplinesCount(): void {
    this.dashboardService.countDisciplines().subscribe(
      (count) => {
        // Find the disciplines top card and update its subtitle with the count
        const disciplinesTopCard = this.topcards.find(card => card.title === 'Disciplines');
        if (disciplinesTopCard) {
          disciplinesTopCard.subtitle = count.toString();
        }
      },
      (error) => {
        console.error('Error fetching disciplines count:', error);
        // Handle error, display error message, etc.
      }
    );
  }

  updateManagersCount(): void {
    this.dashboardService.countManagers().subscribe(
      (count) => {
        // Find the managers top card and update its subtitle with the count
        const managersTopCard = this.topcards.find(card => card.title === 'Managers');
        if (managersTopCard) {
          managersTopCard.subtitle = count.toString();
        }
      },
      (error) => {
        console.error('Error fetching managers count:', error);
        // Handle error, display error message, etc.
      }
    );
  }

  updateAdherentsCount(): void {
    this.dashboardService.countAdherents().subscribe(
      (count) => {
        const adherentsTopCard = this.topcards.find(card => card.title === 'Adherents');
        if (adherentsTopCard) {
          adherentsTopCard.subtitle = count.toString();
        }
      },
      (error) => {
        console.error('Error fetching adherents count:', error);
        // Handle error, display error message, etc.
      }
    );
  }
  
  updateEntraineursCount(): void {
    this.dashboardService.countEntraineurs().subscribe(
      (count) => {
        const entraineursTopCard = this.topcards.find(card => card.title === 'Entraineurs');
        if (entraineursTopCard) {
          entraineursTopCard.subtitle = count.toString();
        }
      },
      (error) => {
        console.error('Error fetching entraineurs count:', error);
        // Handle error, display error message, etc.
      }
    );
  }
  
  updateEvenementsCount(): void {
    this.dashboardService.countEvenements().subscribe(
      (count) => {
        const evenementsTopCard = this.topcards.find(card => card.title === 'Events');
        if (evenementsTopCard) {
          evenementsTopCard.subtitle = count.toString();
        }
      },
      (error) => {
        console.error('Error fetching evenements count:', error);
        // Handle error, display error message, etc.
      }
    );
  }
  


}
