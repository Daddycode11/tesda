import { Component } from '@angular/core';
import { ProgramsService } from '../../../services/programs.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from '../../../services/toastr.service';
import { ServiceType } from '../../../models/Services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss',
})
export class CreateServiceComponent {
  serviceForm: FormGroup;
  selectedIcon: File | null = null;
  isLoading = false;

  serviceTypes = Object.values(ServiceType);
  iconPreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private programService: ProgramsService
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      type: [ServiceType.SERVICE, Validators.required],
      link: [''],
    });
  }

  onIconSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedIcon = file || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.iconPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.iconPreviewUrl = null;
    }
  }

  async submit() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    try {
      await this.programService.create(
        this.serviceForm.value,
        this.selectedIcon
      );
      this.toastr.showSuccess('Service created successfully');
      this.serviceForm.reset({ type: ServiceType.SERVICE });
      this.selectedIcon = null;
    } catch (err) {
      console.error(err);
      this.toastr.showError('Failed to create service');
    } finally {
      this.isLoading = false;
    }
  }
}
