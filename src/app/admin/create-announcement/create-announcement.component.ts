import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Announcement } from '../../models/Announcement';
import { CommonModule } from '@angular/common';
import { ToastrService } from '../../services/toastr.service';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-announcement.component.html',
  styleUrl: './create-announcement.component.scss',
})
export class CreateAnnouncementComponent {
  announcementForm: FormGroup;
  imageFile?: File;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private announcementService: AnnouncementService
  ) {
    this.announcementForm = this.fb.nonNullable.group({
      type: ['announcement', Validators.required],
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      source: [''], // optional
    });
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.imageFile = input.files[0];
    }
  }

  submit(): void {
    if (this.announcementForm.invalid || !this.imageFile) return;

    const formValue = this.announcementForm.value;

    const announcement: Announcement = {
      id: '', // Will be set by Firestore
      image: '', // Will be set after upload
      type: formValue.type,
      title: formValue.title,
      summary: formValue.summary,
      content: formValue.content,
      source: formValue.source || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.loading = true;
    this.announcementService
      .create(announcement, this.imageFile)
      .then(() => {
        this.toastr.showSuccess('Successfully Created!');
        this.loading = false;
        this.announcementForm.reset();
      })
      .catch((e) => this.toastr.showError(e['message'] ?? 'Unknown Error'))
      .finally(() => {
        this.loading = false;
      });
  }
}
