import { Component } from '@angular/core';
import { CareerService } from '../../../services/career.service';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss',
})
export class CareersComponent {
  careers$ = this.careerService.getAll();
  selectedCareer: any = null;

  openOffcanvas(item: any) {
    this.selectedCareer = item;
  }
  constructor(private careerService: CareerService) {}
}
