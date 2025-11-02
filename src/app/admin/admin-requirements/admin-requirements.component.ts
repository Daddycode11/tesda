import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Requirements } from '../../models/Requirement';
import { CreateRequirementsDialogComponent } from './create-requirements-dialog/create-requirements-dialog.component';
import { RequirementService } from '../../services/requirement.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-requirements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-requirements.component.html',
  styleUrl: './admin-requirements.component.scss',
})
export class AdminRequirementsComponent implements OnInit, OnDestroy {
  requirements$: Requirements[] = [];
  subscription = new Subscription();
  constructor(
    private modalService: NgbModal,
    private requirementService: RequirementService
  ) {}

  openCreateRequirementDialog(requirement: Requirements | null = null) {
    const modalRef = this.modalService.open(CreateRequirementsDialogComponent);
    modalRef.componentInstance.requirement = requirement;
  }
  ngOnInit(): void {
    this.subscription = this.requirementService.getAll().subscribe((data) => {
      this.requirements$ = data;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  trackById(index: number, item: Requirements): string {
    return item.id;
  }

  deleteRequirement(id: string) {
    if (confirm('Are you sure you want to delete this requirement?')) {
      this.requirementService.delete(id).then(() => {
        this.requirements$ = this.requirements$.filter((r) => r.id !== id);
      });
    }
  }
}
