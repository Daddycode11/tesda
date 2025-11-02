import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../models/Announcement';
import { AnnouncementService } from '../../services/announcement.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss',
})
export class AnnouncementComponent implements OnInit {
  announcements$!: Observable<Announcement[]>;

  constructor(
    private announcementService: AnnouncementService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.announcements$ = this.activatedRoute.queryParams.pipe(
      switchMap((params) => {
        const type = params['type'] || null;
        return this.announcementService.getAll(type);
      })
    );
  }
}
