import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ToolbarComponent } from './common/toolbar/toolbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterDialogComponent } from './common/register-dialog/register-dialog.component';
import { LoginDialogComponent } from './common/login-dialog/login-dialog.component';
import { AuthService } from './services/auth.service';
import { User } from './models/Users';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tesda';
}
