import { Component } from '@angular/core';
import { CareerService } from '../../../services/career.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule],
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
