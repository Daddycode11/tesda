import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '../../../services/programs.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from '../../../services/toastr.service';
import { Services, ServiceType } from '../../../models/Services';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss',
})
export class CreateServiceComponent implements OnInit {
  serviceForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  serviceTypes = Object.values(ServiceType);
  id: string | null = null;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private programService: ProgramsService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      type: [
        ServiceType.CompetencyAssessmentAndCertification,
        Validators.required,
      ],
      requirements: this.fb.array([this.createRequirementField()]),
    });
  }
  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.loadService(this.id);
      }
    });
  }

  async loadService(id: string) {
    this.isLoading = true;
    try {
      const service: Services | null = await this.programService.getById(id);
      if (service) {
        // Patch basic form values
        this.serviceForm.patchValue({
          title: service.title,
          description: service.description,
          type: service.type,
        });

        // Clear existing requirements and populate with service's requirements
        const reqArray = this.serviceForm.get('requirements') as FormArray;
        reqArray.clear();
        service.requirements?.forEach((req) => {
          reqArray.push(this.fb.control(req, Validators.required));
        });
      }
    } catch (error) {
      this.toastr.showError('Failed to load service.');
    } finally {
      this.isLoading = false;
    }
  }

  /** Creates a single requirement form control */
  createRequirementField(): import('@angular/forms').FormControl<
    string | null
  > {
    return this.fb.control('', [
      Validators.required,
      Validators.maxLength(200),
    ]);
  }

  /** Get requirements FormArray */
  get requirements(): FormArray {
    return this.serviceForm.get('requirements') as FormArray;
  }

  /** Add new requirement field */
  addRequirement() {
    this.requirements.push(this.createRequirementField());
  }

  /** Remove a specific requirement field */
  removeRequirement(index: number) {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  back() {
    this.location.back();
  }

  onIconSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFile = file || null;
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
        this.selectedFile
      );

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service created successfully.',
        confirmButtonColor: '#3085d6',
      });

      this.selectedFile = null;
      this.serviceForm.reset();
      this.requirements.clear();
      this.requirements.push(this.createRequirementField());
      this.back();
    } catch (err) {
      console.error(err);

      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to create service. Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      this.isLoading = false;
    }
  }
}
