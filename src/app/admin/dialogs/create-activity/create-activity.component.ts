import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModalModule,
  NgbModule,
  NgbTimepickerModule,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Activity } from '../../../models/Activity';
import { CommonModule } from '@angular/common';
import { ToastrService } from '../../../services/toastr.service';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
  ],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.scss',
})
export class CreateActivityComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() activity: Activity | null = null;

  activityForm: FormGroup;
  selectedImage: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activityService: ActivityService
  ) {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.activity) {
      this.activityForm.patchValue({
        title: this.activity.title,
        image: this.activity.image,
        location: this.activity.location,

        description: this.activity.description,
        date: this.activity.date,
        time: this.activity.time,
      });
    }
  }

  onSelectedImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.activityForm.patchValue({ image: input.files[0].name });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const now = new Date();
    const formValue = this.activityForm.value;
    const { date, time } = this.activityForm.value;

    const sortableDate = new Date(
      date.year,
      date.month - 1,
      date.day,
      time.hour,
      time.minute,
      0
    );

    const activityPayload: Activity = {
      ...this.activity,
      ...formValue,
      sortableDate: sortableDate,
      id: this.activity?.id || crypto.randomUUID(),
      createdAt: this.activity?.createdAt || now,
      updatedAt: now,
    };

    try {
      if (this.activity) {
        await this.activityService.update(activityPayload, this.selectedImage);
        this.toastr.showSuccess('Activity updated successfully');
      } else {
        if (!this.selectedImage) {
          this.toastr.showError('Please select an image');
          this.loading = false;
          return;
        }
        await this.activityService.add(activityPayload, this.selectedImage);
        this.toastr.showSuccess('Activity created successfully');
      }

      this.activeModal.close(activityPayload);
    } catch (error) {
      console.error(error);
      this.toastr.showError('Something went wrong. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
