import { Injectable, signal, TemplateRef } from '@angular/core';
export interface Toast {
  message: string;
  classname?: string;
  delay?: number;
}
@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private showToast(message: string, classname: string, duration: number) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `android-toast ${classname}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
    }, duration - 300); // start fading before removal

    setTimeout(() => {
      document.body.removeChild(toast);
    }, duration);
  }

  showSuccess(message: string, duration: number = 1000) {
    this.showToast(message, 'toast-success', duration);
  }

  showWarning(message: string, duration: number = 1000) {
    this.showToast(message, 'toast-warning', duration);
  }

  showError(message: string, duration: number = 1000) {
    this.showToast(message, 'toast-error', duration);
  }

  showCustom(message: string, duration: number = 1000) {
    this.showToast(message, 'toast-custom', duration);
  }
}
