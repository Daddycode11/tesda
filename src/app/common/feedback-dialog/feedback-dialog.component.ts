import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackService } from '../../services/feedback.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from '../../services/toastr.service';
import { Sentiment } from '../../models/Feedback';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.scss',
})
export class FeedbackDialogComponent {
  feedbackForm: FormGroup;
  loading = false;
  sentiments = Object.values(Sentiment);
  iconMap: Record<Sentiment, string> = {
    [Sentiment.VeryDissatisfied]: 'bi-emoji-angry',
    [Sentiment.Dissatisfied]: 'bi-emoji-frown',
    [Sentiment.Neutral]: 'bi-emoji-neutral',
    [Sentiment.Satisfied]: 'bi-emoji-smile',
    [Sentiment.VerySatisfied]: 'bi-emoji-heart-eyes',
  };
  constructor(
    public activeModal: NgbActiveModal,
    private feedbackService: FeedbackService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      sentiment: [Sentiment.Neutral],
      comment: [''],
      allowFollowUp: [true],
    });
  }

  async submit(): Promise<void> {
    if (this.feedbackForm.invalid) {
      this.toastr.showWarning('Please fill up all forms');
      return;
    }

    this.loading = true;
    const { sentiment, comment, allowFollowUp } = this.feedbackForm.value;

    try {
      await this.feedbackService.createFeedback(
        sentiment,
        comment,
        allowFollowUp
      );

      this.toastr.showSuccess('Feedback submitted. Thank you!');
      this.activeModal.close();
    } catch (e) {
      this.toastr.showError('Failed to submit feedback.');
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
