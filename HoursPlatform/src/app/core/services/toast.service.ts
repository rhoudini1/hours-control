import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  message = signal<string | null>(null);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Shows a toast with the given message for `duration` milliseconds.
   * Calling this while a toast is already visible resets the timer.
   */
  show(msg: string, duration = 3000): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.message.set(msg);

    this.timeoutId = setTimeout(() => {
      this.message.set(null);
      this.timeoutId = null;
    }, duration);
  }
}
