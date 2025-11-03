import { Component, inject } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss',
})
export class ServicesListComponent {
  promgramService = inject(ProgramsService);
  services$ = this.promgramService.getAll();
  constructor() {}
}
