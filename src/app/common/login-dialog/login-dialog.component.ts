import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/Users';
import { ToastrService } from '../../services/toastr.service';
import { dA } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  activeModal = inject(NgbActiveModal);
  loginForm: FormGroup;
  loading$ = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading$ = true;

    this.authService
      .loginWithEmailAndPassword(email, password)
      .then((data) => {
        this.loading$ = false;

        if (data.type === UserType.ADMIN) {
          this.authService.logout();
          this.toastr.showError('Admin cannot log in here');
          this.activeModal.close(null);
        } else {
          this.toastr.showSuccess('Successfully logged in!');
          this.activeModal.close(data.id); // ✅ return user ID
        }
      })
      .catch((e) => {
        this.toastr.showError(e['message'] ?? 'Unknown error');
        this.activeModal.close(null); // ❌ login failed
        this.loading$ = false;
      });
  }

  loginWithGoogle() {
    this.loading$ = true;

    this.authService
      .loginWithGoogle()
      .then((data) => {
        this.loading$ = false;

        if (data.type === UserType.ADMIN) {
          this.authService.logout();
          this.toastr.showError('Admin cannot log in here');
          this.activeModal.close(null);
        } else {
          this.toastr.showSuccess('Successfully logged in!');
          this.activeModal.close(data.id); // ✅ return user ID
        }
      })
      .catch((e) => {
        this.toastr.showError(e['message'] ?? 'Unknown error');
        this.activeModal.close(null); // ❌ login failed
        this.loading$ = false;
      });
  }
}
