import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EquipeService } from 'src/app/services/equipe.service';
import { EvenementService } from 'src/app/services/evenement.service';
import { Equipe } from 'src/models/equipe.model';
import { Evenement } from 'src/models/evenement.model';

@Component({
  selector: 'app-add-test',
  templateUrl: './calendrier.component.html',
})
export class CalendrierComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [],
  };

  // Filter properties
  showCheckboxes1: boolean = true;
  showCheckboxes2: boolean = true;
  showCalendar: boolean = true;
  selectedEventTypes: string[] = [];
  selectedTeams: string[] = [];
  allEvents: any[] = [];
  typeEventsFilter: string[] = ['MATCH_AMICAL', 'EVENEMENT_PERSONNALISE', 'TEST_EVALUATION', 'COMPETITION'];
  equipes: Equipe[] = [];
  selectedDate: Date | null;


  constructor(public dialog: MatDialog, private evenementService: EvenementService, private equipeService: EquipeService) { }

  ngOnInit(): void {
    this.getEvenements();
    this.getEquipes();
  }

  handleEventClick(info: EventClickArg) {
    const clickedEvent = info.event._def.extendedProps as Evenement;
    console.log(clickedEvent); // Log clickedEvent to inspect its contents
    const dialogRef = this.dialog.open(EventPopupComponent, {
      data: clickedEvent
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEvenements();
      }
    });
  }
  


  handleDateClick(arg: DateClickArg) {
    alert('Date clicked: ' + arg.dateStr);
  }

  getEquipes(): void {
    this.equipeService.getEquipes().subscribe(
      (equipes) => {
        console.log('Equipes fetched successfully', equipes);
        this.equipes = equipes;
      },
      (error) => {
        console.error('Error fetching equipes', error);
      }
    );
  }

  getEvenements(): void {
    this.evenementService.getEvenements().subscribe(
      (evenement) => {
        console.log('Events fetched successfully', evenement);
        this.allEvents = evenement;
        this.filterEvents();
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }

  filterEvents(): void {
    this.calendarOptions.events = this.allEvents.filter(event =>
      (this.selectedEventTypes.length === 0 || this.selectedEventTypes.includes(event.type)) &&
      (this.selectedTeams.length === 0 || this.selectedTeams.includes(event.convocationEquipe?.nom)) &&
      (!this.selectedDate || this.isSameDate(event.date, this.selectedDate))
    ).map(event => ({
      ...event,
      title: `${event.nomEvent} - ${event.type}`,
      start: event.date,
      backgroundColor: event.statut == 'Annulé' ? '#FF1354' : '#B7EE3E', // Set background color based on event type
      borderColor: event.statut == 'Annulé' ? '#FF1354' : '#B7EE3E',
      textColor: '#000000',
    }));
  }


  renderEventContent(info: { event: any; }) {
    return {
      html: `<div class="event-name">${info.event.title}</div><div class="event-type">${info.event.extendedProps.type}</div>`
    };
  }

  applyFilterByType(eventType: string): void {
    if (this.selectedEventTypes.includes(eventType)) {
      this.selectedEventTypes = this.selectedEventTypes.filter(type => type !== eventType);
    } else {
      this.selectedEventTypes.push(eventType);
    }
    this.filterEvents();
  }

  applyFilterByEquipe(equipe: string): void {
    console.log('Applying filter for equipe:', equipe);
    if (this.selectedTeams.includes(equipe)) {
      this.selectedTeams = this.selectedTeams.filter(team => team !== equipe);
    } else {
      this.selectedTeams.push(equipe);
    }
    console.log('Selected teams after filter:', this.selectedTeams);
    this.filterEvents();
  }

  applyDateFilter(selectedDate: Date): void {
    this.selectedDate = selectedDate;
    this.filterEvents();
  }

  isSameDate(date1: Date | string, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  toggleCheckboxesVisibility1(): void {
    this.showCheckboxes1 = !this.showCheckboxes1;
  }

  toggleCheckboxesVisibility2(): void {
    this.showCheckboxes2 = !this.showCheckboxes2;
  }

  toggleCalendarVisibility(): void {
    this.showCalendar = !this.showCalendar;
  }

  clearDateFilter(): void {
    // Clear the selected date and apply the filter
    this.selectedDate = null;
    this.filterEvents();
  }
}

@Component({
  templateUrl: './eventPopup.component.html',
})
export class EventPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public evenement: Evenement
  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Close the dialog with 'false' value
  }
}

