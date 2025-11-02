import { Component, Input, OnInit } from '@angular/core';
import { Requirements } from '../../../models/Requirement';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from '../../../services/toastr.service';
import { RequirementService } from '../../../services/requirement.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-requirements-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './create-requirements-dialog.component.html',
  styleUrl: './create-requirements-dialog.component.scss',
})
export class CreateRequirementsDialogComponent implements OnInit {
  @Input() requirement: Requirements | null = null;
  requirementForm: FormGroup;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private requirementService: RequirementService
  ) {
    this.requirementForm = fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.requirement) {
      const { title, description, items } = this.requirement;
      this.requirementForm.patchValue({ title, description });

      const itemsArray = this.requirementForm.get('items') as FormArray;
      items.forEach((item) => itemsArray.push(this.fb.control(item)));
    } else {
      this.addItem(); // start with one empty item
    }
  }

  get itemsArray(): FormArray {
    return this.requirementForm.get('items') as FormArray;
  }

  addItem() {
    this.itemsArray.push(this.fb.control('', Validators.required));
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }

  submit() {
    if (this.requirementForm.invalid) {
      this.toastr.showError('Please fill out all required fields');
      return;
    }

    const { title, description } = this.requirementForm.value;
    const items: string[] = this.itemsArray.value;

    if (this.requirement) {
      this.update(title, description, items);
    } else {
      this.create(title, description, items);
    }
  }

  create(title: string, description: string, items: string[]) {
    this.requirementService
      .create(title, description, items)
      .then(() => {
        this.toastr.showSuccess('Successfully Created');
        this.activeModal.close();
      })
      .catch((e) => this.toastr.showError(e['message'] ?? 'Unknown Error'))
      .finally(() => {
        this.isLoading = false;
      });
  }

  update(title: string, description: string, items: string[]) {
    if (!this.requirement) return;

    const updatedRequirement: Requirements = {
      ...this.requirement,
      title,
      description,
      items,
    };

    this.requirementService
      .update(updatedRequirement)
      .then(() => {
        this.toastr.showSuccess('Successfully Updated');
        this.activeModal.close();
      })
      .catch((e) => this.toastr.showError(e['message'] ?? 'Unknown Error'))
      .finally(() => {
        this.isLoading = false;
      });
  }

  get typedItems(): FormControl[] {
    return this.itemsArray.controls as FormControl[];
  }
}
