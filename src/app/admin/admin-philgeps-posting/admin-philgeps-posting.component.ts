import { Component } from '@angular/core';
import { PostingService } from '../../services/posting.service';
import {
  NgbModal,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PhilGEPS } from '../../models/PhilGEPS';
import { CreatePostingComponent } from '../dialogs/create-posting/create-posting.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-philgeps-posting',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    CommonModule,
  ],
  templateUrl: './admin-philgeps-posting.component.html',
  styleUrl: './admin-philgeps-posting.component.scss',
})
export class AdminPhilgepsPostingComponent {
  postings: PhilGEPS[] = [];
  filteredPostings: PhilGEPS[] = [];

  searchTerm: string = '';
  page = 1;
  pageSize = 10;

  constructor(
    private postingService: PostingService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadPostings();
  }

  loadPostings() {
    this.postingService.getAll().subscribe((data) => {
      this.postings = data;
      this.refresh();
    });
  }

  refresh() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPostings = this.postings.filter(
      (post) =>
        post.reference.toLowerCase().includes(term) ||
        post.project.toLowerCase().includes(term) ||
        post.contractor.toLowerCase().includes(term) ||
        post.jobOrder.toLowerCase().includes(term)
    );
  }

  create(post: PhilGEPS | null = null) {
    const modalRef = this.modalService.open(CreatePostingComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.post = post;
    modalRef.result
      .then((result) => {
        if (result) this.loadPostings();
      })
      .catch(() => {});
  }

  edit(post: PhilGEPS) {
    this.create(post);
  }

  delete(post: PhilGEPS) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This posting will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.postingService
          .delete(post.id)
          .then(() => {
            Swal.fire('Deleted!', 'The posting has been deleted.', 'success');
            this.loadPostings();
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to delete posting.', 'error');
          });
      }
    });
  }
}
