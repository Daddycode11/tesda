import { Component } from '@angular/core';
import { PostingService } from '../../services/posting.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-phil-geps-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phil-geps-list.component.html',
  styleUrl: './phil-geps-list.component.scss',
})
export class PhilGepsListComponent {
  postings$ = this.postingService.getAll();
  constructor(private postingService: PostingService) {}
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
