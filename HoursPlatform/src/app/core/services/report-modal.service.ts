import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportModalService {
  isOpen = signal(false);

  /**
   * Incrementing counter — pages that need to react to a new report
   * (e.g. SquadDetailsComponent) can watch this signal via an effect.
   */
  reportCreated = signal(0);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  notifyCreated(): void {
    this.reportCreated.update((n) => n + 1);
  }
}
