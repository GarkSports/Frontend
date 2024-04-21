import { Routes } from '@angular/router';

import { AppChatComponent } from './chat/chat.component';
import { AppNotesComponent } from './notes/notes.component';
import { AppTodoComponent } from './todo/todo.component';
import { AppPermissionComponent } from './permission/permission.component';
import { AppEmailComponent } from './email/email.component';
import { DetailComponent } from './email/detail/detail.component';
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { AppTicketlistComponent } from './ticketlist/ticketlist.component';
import { AppContactComponent } from './contact/contact.component';
import { AppCoursesComponent } from './courses/courses.component';
import { AppCourseDetailComponent } from './courses/course-detail/course-detail.component';
import { AppEmployeeComponent } from './employee/employee.component';
import { AppInvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { AppAddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AppInvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { AppEditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { AppBlogsComponent } from './blogs/blogs.component';
import { AppBlogDetailsComponent } from './blogs/details/details.component';
import { DisciplineComponent } from './discipline/discipline.component';
import { AcademieComponent } from './academie/academie.component';
import { AppBloglistComponent } from './blogs/bloglist/blog.component';
import { AcademieProfileComponent } from './academie-profile/academie-profile.component';
import { EquipeComponent } from './equipe/equipe.component';
import { PaiementComponent } from './paiement/paiement.component';
import { ArchivedAcademieComponent } from './archived-academie/academie.component';
import { AppManagerlistComponent } from './admin/managerlist.component';
import { AppStafflistComponent } from './managers/staff/stafflist.component';
import { AppRoleslistComponent } from './managers/roles/roleslist.component';
import { AppProfilComponent } from './managers/profil/profil.component';
import { DisciplineManagerComponent } from './discipline-manager/discipline.component';


export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'chat',
        component: AppChatComponent,
        data: {
          title: 'Chat',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Chat' },
          ],
        },
      },
      {
        path: 'calendar',
        component: AppFullcalendarComponent,
        data: {
          title: 'Calendar',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Calendar' },
          ],
        },
      },
      {
        path: 'notes',
        component: AppNotesComponent,
        data: {
          title: 'Notes',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Notes' },
          ],
        },
      },
      { path: 'email', redirectTo: 'email/inbox', pathMatch: 'full' },
      {
        path: 'email/:type',
        component: AppEmailComponent,
        data: {
          title: 'Email',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Email' },
          ],
        },
        children: [
          {
            path: ':id',
            component: DetailComponent,
            data: {
              title: 'Email Detail',
              urls: [
                { title: 'Dashboard', url: '/dashboards/dashboard1' },
                { title: 'Email Detail' },
              ],
            },
          },
        ],
      },
      {
        path: 'permission',
        component: AppPermissionComponent,
        data: {
          title: 'Roll Base Access',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Roll Base Access' },
          ],
        },
      },
      {
        path: 'todo',
        component: AppTodoComponent,
        data: {
          title: 'Todo App',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Todo App' },
          ],
        },
      },
      {
        path: 'taskboard',
        component: AppTaskboardComponent,
        data: {
          title: 'Taskboard',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Taskboard' },
          ],
        },
      },
      {
        path: 'tickets',
        component: AppTicketlistComponent,
        data: {
          title: 'Tickets',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Tickets' },
          ],
        },
      },
      {
        path: 'managers',
        component: AppManagerlistComponent,
        data: {
          title: 'Managers',
          urls: [
            { title: 'Managers', url: '/dashboards/dashboard1' },
            { title: 'Managers' },
          ],
        },
      },
      {
        path: 'staff',
        component: AppStafflistComponent,
        data: {
          title: 'Staff',
          urls: [
            { title: 'Staff', url: '/dashboards/dashboard1' },
            { title: 'Staff' },
          ],
        },
      },
      {
        path: 'roles',
        component: AppRoleslistComponent,
        data: {
          title: 'Roles',
          urls: [
            { title: 'Roles', url: '/dashboards/dashboard1' },
            { title: 'Roles' },
          ],
        },
      },
      {
        path: 'profil',
        component: AppProfilComponent,
        data: {
          title: 'Profil',
          urls: [
            { title: 'Profil', url: '/dashboards/dashboard1' },
            { title: 'Profil' },
          ],
        },
      },
      {
        path: 'contacts',
        component: AppContactComponent,
        data: {
          title: 'Contacts',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Contacts' },
          ],
        },
      },
      {
        path: 'courses',
        component: AppCoursesComponent,
        data: {
          title: 'Courses',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Courses' },
          ],
        },
      },
      {
        path: 'courses/coursesdetail/:id',
        component: AppCourseDetailComponent,
        data: {
          title: 'Course Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Course Detail' },
          ],
        },
      },
      {
        path: 'blog/post',
        component: AppBlogsComponent,
        data: {
          title: 'Posts',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Posts' },
          ],
        },
      },
      {
        path: 'blog/postslist',
        component: AppBloglistComponent,
        data: {
          title: 'PostsList',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'PostsList' },
          ],
        },
      },    
      {
        path: 'blog/detail/:id',
        component: AppBlogDetailsComponent,
        data: {
          title: 'Blog Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Blog Detail' },
          ],
        },
      },
      {
        path: 'employee',
        component: AppEmployeeComponent,
        data: {
          title: 'Employee',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Employee' },
          ],
        },
      },
      {
        path: 'archivedacademie',
        component: ArchivedAcademieComponent,
        data: {
          title: 'Archived Academies',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Archived Academies' },
          ],
        },
      },
      {
        path: 'academieprofile',
        component: AcademieProfileComponent,
        data: {
          title: 'Academie Profile',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Academie Profile' },
          ],
        },
      },
      {
        path: 'equipe',
        component: EquipeComponent,
        data: {
          title: 'Equipe',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Equipe' },
          ],
        },
      },
      {
        path: 'paiement',
        component: PaiementComponent,
        data: {
          title: 'Paiement',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Paiement' },
          ],
        },
      },
      {
        path: 'discipline',
        component: DisciplineComponent,
        data: {
          title: 'Discipline',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Discipline' },
          ],
        },
      },
      {
        path: 'disciplinemanager',
        component: DisciplineManagerComponent,
        data: {
          title: 'Discipline Manager',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Discipline Manager' },
          ],
        },
      },
      {
        path: 'academie',
        component: AcademieComponent,
        data: {
          title: 'Academie',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Academie' },
          ],
        },
      },
      {
        path: 'invoice',
        component: AppInvoiceListComponent,
        data: {
          title: 'Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Invoice' },
          ],
        },
      },
      {
        path: 'addInvoice',
        component: AppAddInvoiceComponent,
        data: {
          title: 'Add Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Add Invoice' },
          ],
        },
      },
      {
        path: 'viewInvoice/:id',
        component: AppInvoiceViewComponent,
        data: {
          title: 'View Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'View Invoice' },
          ],
        },
      },
      {
        path: 'editinvoice/:id',
        component: AppEditInvoiceComponent,
        data: {
          title: 'Edit Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Edit Invoice' },
          ],
        },
      },
    ],
  },
];
