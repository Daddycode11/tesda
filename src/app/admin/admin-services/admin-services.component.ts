import { Component, inject, OnInit } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { debounceTime, Observable, of, switchMap } from 'rxjs';
import { Services, ServiceType } from '../../models/Services';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import {
  NgbTypeaheadModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DecimalPipe,
    NgbTypeaheadModule,
    NgbPaginationModule,
  ],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.scss',
})
export class AdminServicesComponent implements OnInit {
  programService = inject(ProgramsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  type$ = ['All Services', ...Object.values(ServiceType)];

  typeControl = new FormControl('All Services');
  searchControl = new FormControl('');

  services: Services[] = [];
  lastIndex: QueryDocumentSnapshot<Services> | null = null;
  isLoading = false;

  // Pagination
  page = 1;
  pageSize = 10;
  collectionSize = 100; // Total items, update if available from Firestore

  ngOnInit(): void {
    // Initialize from query params
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.typeControl.setValue(params.get('type') || 'All Services', {
        emitEvent: false,
      });
      this.searchControl.setValue(params.get('search') || '', {
        emitEvent: false,
      });
      this.page = Number(params.get('page')) || 1;
      this.pageSize = Number(params.get('size')) || 10;

      this.refreshServices();
    });

    this.typeControl.valueChanges.subscribe(() => this.refreshServices());
    this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => this.refreshServices());
  }

  async refreshServices() {
    this.services = [];
    this.lastIndex = null;
    await this.loadServices();
  }

  async loadServices() {
    if (this.isLoading) return;

    this.isLoading = true;
    const type =
      this.typeControl.value === 'All Services' ? null : this.typeControl.value;
    const search = this.searchControl.value || null;

    try {
      const res = await this.programService.getServices(
        type,
        this.lastIndex,
        this.pageSize,
        search
      );

      this.services = res.items;
      this.lastIndex = res.lastIndex;
      this.collectionSize = res.total ?? 10;
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      this.isLoading = false;
    }
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.refreshServices();
  }

  onPageSizeChange() {
    this.page = 1;
    this.refreshServices();
  }
}
