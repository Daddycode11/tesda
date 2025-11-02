import { Component, Input, OnInit, Output } from '@angular/core';
import { Announcement } from '../../../models/Announcement';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../../services/announcement.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [CommonModule, CommonModule, RouterModule],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.scss',
})
export class AnnouncementListComponent implements OnInit {
  announcements$ = this.announcementService.getPartialAnnouncements();
  constructor(private announcementService: AnnouncementService) {}
  ngOnInit(): void {}
}
