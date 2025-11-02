import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss',
})
export class AdminMainComponent {}
