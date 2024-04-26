import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

@Component({
    selector: 'app-add-test',
    templateUrl: './calendrier.component.html',
})
export class CalendrierComponent {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: this.handleDateClick.bind(this),
        events: [
            { title: 'Event 1', date: '2024-04-17' },
            { title: 'Event 2', date: '2024-04-18' }
        ]
    };

    constructor() { }

    handleDateClick(arg: DateClickArg) {
        alert('Date clicked: ' + arg.dateStr);
    }
}
