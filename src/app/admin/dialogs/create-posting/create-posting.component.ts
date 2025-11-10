import { Component, Input, OnInit } from '@angular/core';
import { PhilGEPS } from '../../../models/PhilGEPS';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostingService } from '../../../services/posting.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { reference } from '@popperjs/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-posting',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create-posting.component.html',
  styleUrl: './create-posting.component.scss',
})
export class CreatePostingComponent implements OnInit {
  @Input() post: PhilGEPS | null = null;
  isLoading: boolean = false;
  postingForm: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private postingService: PostingService,
    private fb: FormBuilder
  ) {
    this.postingForm = fb.nonNullable.group({
      reference: ['', Validators.required],
      project: ['', Validators.required],
      budget: [null, Validators.required],
      contractor: ['', Validators.required],
      jobOrder: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.post !== null) {
      this.postingForm.patchValue({
        reference: this.post.reference,
        project: this.post.project,
        budget: this.post.budget,
        contractor: this.post.contractor,
        jobOrder: this.post.jobOrder,
      });
    }
  }

  submit() {
    if (this.postingForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill out all required fields.',
      });
      return;
    }

    const { reference, project, budget, contractor, jobOrder } =
      this.postingForm.value;
    const postData: PhilGEPS = {
      id: this.post?.id || '',
      reference,
      project,
      budget,
      contractor,
      jobOrder,
      createdAt: this.post?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (this.post === null) {
      this.create(postData);
    } else {
      this.update(postData);
    }
  }

  create(post: PhilGEPS) {
    this.isLoading = true;
    this.postingService
      .create(post)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Created Successfully',
          text: 'New posting has been added.',
        });
        this.activeModal.close(true);
      })
      .catch((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Create',
          text: e.message || 'Something went wrong.',
        });
      })
      .finally(() => (this.isLoading = false));
  }

  update(post: PhilGEPS) {
    this.isLoading = true;
    this.postingService
      .update(post)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: 'Posting details have been updated.',
        });
        this.activeModal.close(true);
      })
      .catch((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Update',
          text: e.message || 'Something went wrong.',
        });
      })
      .finally(() => (this.isLoading = false));
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
