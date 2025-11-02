import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss',
})
export class RegisterDialogComponent {
  activeModal = inject(NgbActiveModal);
  loading$ = false;
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.userForm = fb.nonNullable.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(59),
          ],
        ],
        email: ['', [Validators.email, Validators.required]],
        gender: ['', [Validators.required]],
        age: [18, Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: [''],
      },
      { validators: passwordMatchValidator }
    );
  }

  submit() {
    if (this.userForm.invalid) {
      return;
    }
    const { name, email, age, gender, password } = this.userForm.value;
    this.loading$ = true;
    this.authService
      .registerWithEmailAndPassword(name, age, gender, email, password)
      .then(() => {
        this.toastr.showSuccess('Succesfully Registered');

        this.loading$ = false;
        this.userForm.reset();
        this.activeModal.close();
      })
      .catch((e) => {
        this.toastr.showError(e['message'] ?? 'Unknown Error');
      })
      .finally(() => {
        this.loading$ = false;
      });
  }
  registerWithGoogle() {
    this.loading$ = true;
    this.authService
      .registerWithGoogle()
      .then((data) => {
        this.toastr.showSuccess('Successfully Registed');
        this.loading$ = false;
        this.activeModal.close();
      })
      .catch((e) => this.toastr.showError(e['message'] ?? 'Unknown Error'))
      .finally(() => {
        this.loading$ = false;
      });
  }
}

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
