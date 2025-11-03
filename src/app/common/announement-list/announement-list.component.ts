import { Component, inject } from '@angular/core';
import { AnnouncementService } from '../../services/announcement.service';
import { map, shareReplay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-announement-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './announement-list.component.html',
  styleUrl: './announement-list.component.scss',
})
export class AnnounementListComponent {
  private announcementService = inject(AnnouncementService);
  readonly all$ = this.announcementService
    .getAll()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly news$ = this.all$.pipe(
    map((items) => items.filter((item) => item.type === 'news'))
  );

  readonly announcements$ = this.all$.pipe(
    map((items) => items.filter((item) => item.type === 'announcement'))
  );
}
