import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
    selector: 'app-add-test',
    templateUrl: './calendrier.component.html',
})
export class CalendrierComponent implements OnInit {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: this.handleDateClick.bind(this),
        events: []
    };

    constructor(private evenementService: EvenementService) { }

    ngOnInit(): void {
        this.getEvenements();
    }

    handleDateClick(arg: DateClickArg) {
        alert('Date clicked: ' + arg.dateStr);
    }

    getEvenements(): void {
        this.evenementService.getEvenements().subscribe(
            (evenement) => {
                console.log('Extended events fetched successfully', evenement);
                this.calendarOptions.events = evenement.map(event => ({
                    title: `${event.nomEvent}`, // Assuming nomEvent is the name of the event
                    start: event.date, // Assuming date is the date of the event
                    backgroundColor: '#B7EE3E',
                    borderColor: '#B7EE3E',
                    textColor: '#000000',
                    // Add more properties as needed
                }));
            },
            (error) => {
                console.error('Error fetching extended events', error);
            }
        );
    }

}
