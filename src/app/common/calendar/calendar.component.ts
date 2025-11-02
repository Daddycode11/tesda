import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';
@Component({
  selector: 'app-calendar',
  standalone: true,

  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  private activityService = inject(ActivityService);
  selectedActivity: Activity | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),

    eventClassNames: () => ['bg-primary', 'text-white', 'border-0'],

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
  };

  ngOnInit(): void {
    this.activityService.getAll().subscribe((activities: Activity[]) => {
      const events: EventInput[] = activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        start: new Date(activity.sortableDate),
        extendedProps: { ...activity },
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events,
      };
    });
  }

  handleEventClick(arg: EventClickArg): void {
    this.selectedActivity = arg.event.extendedProps['id']
      ? (arg.event.extendedProps as Activity)
      : null;

    const offcanvas = document.getElementById('activityDetails');
    if (offcanvas) {
      const bsOffcanvas = new (window as any).bootstrap.Offcanvas(offcanvas);
      bsOffcanvas.show();
    }
  }

  formatTime(time?: { hour: number; minute: number }): string {
    if (!time) return '';
    const hour = time.hour % 12 || 12;
    const minute = String(time.minute).padStart(2, '0');
    const meridian = time.hour >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${meridian}`;
  }
}
