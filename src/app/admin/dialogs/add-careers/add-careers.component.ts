import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CareerService } from '../../../services/career.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from '../../../services/toastr.service';
import { CommonModule } from '@angular/common';
import { Career } from '../../../models/Careeer';

@Component({
  selector: 'app-add-careers',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-careers.component.html',
  styleUrl: './add-careers.component.scss',
})
export class AddCareersComponent implements OnInit {
  activeDialog = inject(NgbActiveModal);
  isLoading = false;
  careerForm: FormGroup;
  selectedImage: File | null = null;

  @Input() career: Career | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private careerService: CareerService
  ) {
    this.careerForm = fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.maxLength(300)],
    });
  }

  ngOnInit(): void {
    if (this.career) {
      this.careerForm.patchValue({
        title: this.career.title,
        description: this.career.description,
      });
    }
  }

  submit() {
    if (this.careerForm.invalid) {
      this.toastr.showError('Invalid Form');
      return;
    }

    const { title, description } = this.careerForm.value;
    this.isLoading = true;

    if (this.career) {
      this.update(title, description, this.selectedImage);
    } else {
      if (this.selectedImage == null) {
        this.toastr.showWarning('Please Add Image');
        this.isLoading = false;
        return;
      }
      this.create(title, description, this.selectedImage);
    }
  }

  update(title: string, description: string, selectedImage: File | null) {
    if (!this.career) {
      this.toastr.showError('No career selected for update');
      this.isLoading = false;
      return;
    }

    const updatedCareer: Career = {
      ...this.career,
      title,
      description,
    };

    this.careerService.update(updatedCareer, selectedImage).subscribe({
      next: () => {
        this.toastr.showSuccess('Career updated successfully');
        this.activeDialog.close(true);
      },
      error: (err) => {
        console.error('Career update failed:', err);
        this.toastr.showError('Failed to update career');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  create(title: string, description: string, image: File) {
    this.careerService.create(title, description, image).subscribe({
      next: () => {
        this.toastr.showSuccess('Career added successfully');
        this.activeDialog.close(true);
      },
      error: (err) => {
        console.error('Career creation failed:', err);
        this.toastr.showError('Failed to add career');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }
}
