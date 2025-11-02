import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from '../../services/toastr.service';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/Users';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading$ = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.initUser();
  }
  initUser() {
    this.loading$ = true;
    this.authService.getUser().then((data) => {
      console.log(data);
      this.loading$ = false;
      if (data?.type === UserType.ADMIN) {
        this.router.navigate(['/administration/main']);
      }
    });
  }
  submit() {
    if (this.loginForm.invalid) {
      this.toastr.showError('Invalid Form');
      return;
    }
    this.loading$ = true;
    const { email, password } = this.loginForm.value;
    this.authService
      .loginWithEmailAndPassword(email, password)
      .then((data) => {
        if (data.type === UserType.ADMIN) {
          this.toastr.showSuccess('Successfully Login!');
          this.router.navigate(['/administration/main']);
        } else {
          this.toastr.showError('Invalid User');
          this.authService.logout();
        }
      })
      .catch((e) => {
        this.toastr.showError(e['message'] ?? 'Unknown Error');
      })
      .finally(() => (this.loading$ = false));
  }
}
