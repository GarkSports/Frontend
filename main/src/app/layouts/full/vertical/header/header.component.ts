import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  Inject,
  Optional,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from 'src/app/services/auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { ManagerService } from 'src/app/services/manager.service';
import { Manager } from 'src/models/manager.model';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/models/user.model';


export interface Notification {
  title: string;
  body: string;
  image: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  managerSource = new MatTableDataSource<User>([]);
  local_data: any;

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-en.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/assets/images/flag/icon-flag-de.svg',
    },
  ];

  notifications: Notification[] = [];


  constructor(
    private vsidenav: CoreService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User,
    public dialog: MatDialog,
    private translate: TranslateService,
    private authService: AuthService,
    //private messagingService: MessagingService,
    private managerService: ManagerService
  ) {
    translate.setDefaultLang('en');
    this.local_data = { ...data };
  }

  ngOnInit() {
    this.getProfil();
    // this.messagingService.notifications$.subscribe(notifications => {
    //   this.notifications = notifications.map(notification => ({
    //     title: notification.title || 'No Title',
    //     body: notification.body || 'No Body',
    //     image: notification.image || "/assets/images/breadcrumb/emailSv.png"

    //   }));
    // });
  }

  // ngOnInit() {
  //   // Retrieve the user's name from the AuthService or any other service
  //   this.firstname = this.authService.getFirstname();
  // }

  openDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getProfil(): void {
    this.managerService.getProfil().subscribe(
      (profil) => {
        console.log('profil fetched successfully', profil);
        this.managerSource.data = profil;
        this.local_data = profil;
        console.log("firstname", this.managerSource.data);

      },
      (error) => {
        console.error('Error fetching profil', error);
      }
    );
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  logout(): void {
    this.authService.logout().subscribe(
      response => {
        console.log(response); // Handle success response
      },
      error => {
        console.error(error); // Handle error response
      }
    );
  }

  // notifications: notifications[] = [
  //   {
  //     id: 1,
  //     img: '/assets/images/profile/user-1.jpg',
  //     title: 'Roman Joined the Team!',
  //     subtitle: 'Congratulate him',
  //   },
  //   {
  //     id: 2,
  //     img: '/assets/images/profile/user-2.jpg',
  //     title: 'New message received',
  //     subtitle: 'Salma sent you new message',
  //   },
  //   {
  //     id: 3,
  //     img: '/assets/images/profile/user-3.jpg',
  //     title: 'New Payment received',
  //     subtitle: 'Check your earnings',
  //   },
  //   {
  //     id: 4,
  //     img: '/assets/images/profile/user-4.jpg',
  //     title: 'Jolly completed tasks',
  //     subtitle: 'Assign her new tasks',
  //   },
  //   {
  //     id: 5,
  //     img: '/assets/images/profile/user-5.jpg',
  //     title: 'Roman Joined the Team!',
  //     subtitle: 'Congratulate him',
  //   },
  // ];

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/apps/profil',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-inbox.svg',
      title: 'My Inbox',
      subtitle: 'Messages & Email',
      link: '/apps/email/inbox',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-tasks.svg',
      title: 'My Tasks',
      subtitle: 'To-do and Daily Tasks',
      link: '/apps/taskboard',
    },
  ];

  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'Todo App',
      subtitle: 'Completed task',
      link: '/apps/todo',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-dd-mobile.svg',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      img: '/assets/images/svgs/icon-dd-lifebuoy.svg',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      img: '/assets/images/svgs/icon-dd-message-box.svg',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      img: '/assets/images/svgs/icon-dd-application.svg',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 2,
      title: 'Authentication Design',
      link: '/authentication/side-login',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    },
    {
      id: 5,
      title: 'Notes App',
      link: '/apps/notes',
    },
    {
      id: 6,
      title: 'Employee App',
      link: '/apps/employee',
    },
    {
      id: 7,
      title: 'Todo Application',
      link: '/apps/todo',
    },
    {
      id: 8,
      title: 'Treeview',
      link: '/theme-pages/treeview',
    },
  ];
}

@Component({
  selector: 'search-dialog',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    TablerIconsModule,
    FormsModule
  ],
  templateUrl: 'search-dialog.component.html',
})
export class AppSearchDialogComponent {
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);

  // filtered = this.navItemsData.find((obj) => {
  //   return obj.displayName == this.searchinput;
  // });
}
