import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgxPermissionsModule } from 'ngx-permissions';

import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgScrollbarModule } from 'ngx-scrollbar';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Chat
import { AppChatComponent } from './chat/chat.component';
import { AppChatDialogContentComponent } from './chat/chat.component';
import {NewMessagePageComponent} from './chat/new-message-page/new-message-page.component';
import {AdminNewMessagePageComponent} from './chat/admin-new-message-page/admin-new-message-page.component';

//Contact
import { AppContactDialogContentComponent } from './contact/contact.component';
import { AppContactComponent } from './contact/contact.component';
//Courses
import { AppCoursesComponent } from './courses/courses.component';
import { AppCourseDetailComponent } from './courses/course-detail/course-detail.component';

//Notes
import { AppNotesComponent } from './notes/notes.component';
//Todo
import { AppTodoComponent } from './todo/todo.component';
// Permission
import { AppPermissionComponent } from './permission/permission.component';
//Mailbox
import {
  ListingComponent,
  ListingDialogDataExampleDialogComponent,
} from './email/listing/listing.component';
import { DetailComponent } from './email/detail/detail.component';
import { AppEmailComponent } from './email/email.component';

//Taskboard
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { TaskDialogComponent } from './taskboard/task-dialog.component';
import { OkAppTaskComponent } from './taskboard/ok-task/ok-task.component';
import { DeleteAppTaskComponent } from './taskboard/delete-task/delete-task.component';

//Calendar
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { CalendarDialogComponent } from './fullcalendar/fullcalendar.component';
import { CalendarFormDialogComponent } from './fullcalendar/calendar-form-dialog/calendar-form-dialog.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppEmployeeComponent } from './employee/employee.component';
import { AppEmployeeDialogContentComponent } from './employee/employee.component';
import { AppAddEmployeeComponent } from './employee/add/add.component';

import { AppsRoutes } from './apps.routing';
import { MatNativeDateModule } from '@angular/material/core';
import {
  AppTicketlistComponent,
  AppTicketDialogContentComponent,
} from './ticketlist/ticketlist.component';

//Invoice
import { AppInvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { AppInvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { AppAddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AppEditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { OkDialogComponent } from './invoice/edit-invoice/ok-dialog/ok-dialog.component';
import { AddedDialogComponent } from './invoice/add-invoice/added-dialog/added-dialog.component';

// blog
import { AppBlogsComponent } from './blogs/blogs.component';
import { AppBlogDetailsComponent } from './blogs/details/details.component';
import { AppDisciplineDialogContentComponent, DisciplineComponent } from './discipline/discipline.component';
import { AppAddDisciplineComponent } from './discipline/add/add.component';
import { AcademieComponent, AppAcademieDialogContentComponent } from './academie/academie.component';
import { AppAddAcademieComponent } from './academie/add/add.component';
import { ManagerDetailsDialogComponent } from './academie/academie.component';
import { AdresseDetailsDialogComponent } from './academie/academie.component';
import { EditEtatFormComponent } from './academie/academie.component';
import { HistoryPopupComponent } from './academie/academie.component';
import { AcademieProfileComponent } from './academie-profile/academie-profile.component';
import { UpdateProfileDialogComponent } from './academie-profile/academie-profile.component';
import { EquipeComponent } from './equipe/equipe.component';
import { AdherentPopupComponent } from './equipe/equipe.component';
import { EntraineurPopupComponent } from './equipe/equipe.component';
import { AddMemberPopupComponent } from './equipe/equipe.component';
import { AddCoachPopupComponent } from './equipe/equipe.component';
import { PaiementComponent } from './paiement/paiement.component';
import { PaiementDetailsPopupComponent } from './paiement/paiement.component';
import { AddPaiementPopupComponent } from './paiement/paiement.component';
import { PaiementHistoryPopupComponent } from './paiement/paiement.component';
import { detailMembrePopupComponent } from './paiement/paiement.component';
import { ConfirmDialogComponent } from './paiement/paiement.component';
import { ArchivedAcademieComponent } from './archived-academie/academie.component';
import { ArchivedAcademieConfirmationDialogComponent } from './archived-academie/academie.component';
import { ArchivedAcademieConfirmationRestoreDialogComponent } from './archived-academie/academie.component';
import { DisciplineManagerComponent } from './discipline-manager/discipline.component';
import { AppDisciplineManagerDialogContentComponent } from './discipline-manager/discipline.component';
import { AppAddDisciplineManagerComponent } from './discipline-manager/add/add.component';
import { DeleteEventConfirmationDialogComponent } from './evenement/listEvenement/listEvenement.component';
import { UpdateEquipePopupComponent } from './equipe/equipe.component';



import { AppBlogDialogContentComponent, AppBloglistComponent } from './blogs/bloglist/blog.component';
import { AppManagerDialogContentComponent, AppManagerlistComponent,  } from './admin/managerlist.component';
import { AppStaffDialogContentComponent, AppStafflistComponent } from './managers/staff/stafflist.component';
import { AppRolesDialogContentComponent, AppRoleslistComponent } from './managers/roles/roleslist.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendrierComponent } from './evenement/calendrier/calendrier.component';
import { AddEvenementPopupComponent, ListEvenementComponent } from './evenement/listEvenement/listEvenement.component';
import { NavbarComponent } from './evenement/navbar/navbar.component';
import { AppProfilComponent } from './managers/profil/profil.component';
import { UpdateEvenementPopupComponent } from './evenement/listEvenement/listEvenement.component';
import { EventPopupComponent } from './evenement/calendrier/calendrier.component';
import { EntrainementComponent } from './evenement/entrainement/entrainement.component';
import { AddHeureDialogComponent } from './evenement/entrainement/entrainement.component';
import { UpdateHeureDialogComponent } from './evenement/entrainement/entrainement.component';
import { DetailEventDialogComponent } from './evenement/listEvenement/listEvenement.component';
import {AppEmployeeSalaryComponent} from "../../components/dashboard1/employee-salary/employee-salary.component";
import {AppSalesOverviewComponent} from "../../components/dashboard2/sales-overview/sales-overview.component";
import {AppSellingProductComponent} from "../../components/dashboard1/selling-product/selling-product.component";
import {AppTopCardsComponent} from "../../components/dashboard1/top-cards/top-cards.component";
import {AppTopProjectsComponent} from "../../components/dashboard1/top-projects/top-projects.component";
import {AppMonthlyEarningsTwoComponent} from "../../components/dashboard2/monthly-earnings/monthly-earnings.component";
import {AppPaymentGatewaysComponent} from "../../components/dashboard2/payment-gateways/payment-gateways.component";
import {AppPaymentsComponent} from "../../components/dashboard2/payments/payments.component";
import {
  AppProductPerformanceComponent
} from "../../components/dashboard2/product-performance/product-performance.component";
import {AppProductsComponent} from "../../components/dashboard2/products/products.component";
import {
  AppRecentTransactionsComponent
} from "../../components/dashboard2/recent-transactions/recent-transactions.component";
import {AppRevenueUpdatesTwoComponent} from "../../components/dashboard2/revenue-updates/revenue-updates.component";
import {AppSalesProfitComponent} from "../../components/dashboard2/sales-profit/sales-profit.component";
import {AppTotalEarningsComponent} from "../../components/dashboard2/total-earnings/total-earnings.component";
import {AppWeeklyStatsComponent} from "../../components/dashboard1/weekly-stats/weekly-stats.component";
import {AppWelcomeCardComponent} from "../../components/dashboard2/welcome-card/welcome-card.component";
import {AppYearlySalesComponent} from "../../components/dashboard2/yearly-sales/yearly-sales.component";


import { AppEvaluationComponent } from './evaluation/evaluation.component';
import { AppStaffformContentComponent, NotificationDialogComponent } from './managers/staff/staffform.component';
import { AppManagerFormComponent } from './admin/managerform.component';

import {AppComptabiliteComponent} from './comptabilite/comptabilite.component'
import { AddBeneficeDepenseComponent } from './comptabilite/add-benefice-depense/add-benefice-depense.component';
import { UpdateBeneficeDepenseComponent } from './comptabilite/update-benefice-depense/update-benefice-depense.component';
import {AddPostPageComponent} from './blogs/bloglist/add-post-page/add-post-page.component'




@NgModule({
  imports: [
    FullCalendarModule,
    CommonModule,
    RouterModule.forChild(AppsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons),
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    AppEmployeeSalaryComponent,
    AppSalesOverviewComponent,
    AppSellingProductComponent,
    AppTopCardsComponent,
    AppTopProjectsComponent,
    AppMonthlyEarningsTwoComponent,
    AppPaymentGatewaysComponent,
    AppPaymentsComponent,
    AppProductPerformanceComponent,
    AppProductsComponent,
    AppRecentTransactionsComponent,
    AppRevenueUpdatesTwoComponent,
    AppSalesProfitComponent,
    AppTotalEarningsComponent,
    AppWeeklyStatsComponent,
    AppWelcomeCardComponent,
    AppYearlySalesComponent,
  ],
  exports: [TablerIconsModule],
  declarations: [
    UpdateHeureDialogComponent,
    AddHeureDialogComponent,
    EntrainementComponent,
    DetailEventDialogComponent,
    EventPopupComponent,
    UpdateEvenementPopupComponent,
    UpdateEquipePopupComponent,
    DeleteEventConfirmationDialogComponent,
    NavbarComponent,
    CalendrierComponent,
    AddEvenementPopupComponent,
    ListEvenementComponent,
    DisciplineManagerComponent,
    AppDisciplineManagerDialogContentComponent,
    AppAddDisciplineManagerComponent,
    ArchivedAcademieComponent,
    ArchivedAcademieConfirmationDialogComponent,
    ArchivedAcademieConfirmationRestoreDialogComponent,
    PaiementComponent,
    PaiementDetailsPopupComponent,
    AddPaiementPopupComponent,
    PaiementHistoryPopupComponent,
    detailMembrePopupComponent,
    ConfirmDialogComponent,
    EquipeComponent,
    AdherentPopupComponent,
    EntraineurPopupComponent,
    AddMemberPopupComponent,
    AddCoachPopupComponent,
    AcademieProfileComponent,
    UpdateProfileDialogComponent,
    AppChatComponent,
    AppChatDialogContentComponent,
    NewMessagePageComponent,
    AdminNewMessagePageComponent,
    AppPermissionComponent,
    AppNotesComponent,
    AppTodoComponent,
    AppTaskboardComponent,
    TaskDialogComponent,
    OkAppTaskComponent,
    DeleteAppTaskComponent,
    ListingDialogDataExampleDialogComponent,
    ListingComponent,
    DetailComponent,
    AppEmailComponent,
    AppFullcalendarComponent,
    CalendarDialogComponent,
    CalendarFormDialogComponent,
    AppTicketlistComponent,
    AppTicketDialogContentComponent,
    AppContactComponent,
    AppContactDialogContentComponent,
    AppCoursesComponent,
    AppCourseDetailComponent,
    AppEmployeeComponent,
    AppEmployeeDialogContentComponent,
    AppAddEmployeeComponent,
    DisciplineComponent,
    AppDisciplineDialogContentComponent,
    AppAddDisciplineComponent,
    AcademieComponent,
    AppAcademieDialogContentComponent,
    ManagerDetailsDialogComponent,
    AdresseDetailsDialogComponent,
    AppAddAcademieComponent,
    EditEtatFormComponent,
    HistoryPopupComponent,
    AppInvoiceListComponent,
    AppInvoiceViewComponent,
    AppAddInvoiceComponent,
    AppEditInvoiceComponent,
    AddedDialogComponent,
    OkDialogComponent,
    AppBlogsComponent,
    AppBlogDetailsComponent,
    AppBloglistComponent,
    AppBlogDialogContentComponent,
    AppManagerlistComponent,
    AppManagerDialogContentComponent,
    AppStaffformContentComponent,
    AppStafflistComponent,
    AppRolesDialogContentComponent,
    AppRoleslistComponent,
    AppProfilComponent,
    AppEvaluationComponent,
    NotificationDialogComponent,
    AppStaffDialogContentComponent,
    AppManagerFormComponent,
    AppComptabiliteComponent,
    AddBeneficeDepenseComponent,
    UpdateBeneficeDepenseComponent,
    AddPostPageComponent
  ],
  providers: [DatePipe],
})
export class AppsModule {}
