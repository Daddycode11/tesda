import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Services } from '../../models/Services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.scss',
})
export class AdminServicesComponent implements OnInit {
  services$!: Observable<Services[]>;

  constructor(
    private programService: ProgramsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.services$ = this.activatedRoute.queryParams.pipe(
      switchMap((params) => {
        const type = params['type'] || null;
        return this.programService.getByType(type);
      })
    );
  }
}
