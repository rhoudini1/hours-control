import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportModalService {
  /** Controls whether the "Criar lançamento" modal is visible */
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

  /** Call after a successful report creation to notify interested pages */
  notifyCreated(): void {
    this.reportCreated.update((n) => n + 1);
  }
}
