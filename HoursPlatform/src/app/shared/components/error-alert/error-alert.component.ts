import { Component, input, output, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// @ts-ignore
import * as feather from 'feather-icons';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    @if (isVisible()) {
      <div
        class="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-red-50 border border-red-100/50 text-[var(--color-error)]"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex flex-shrink-0 items-center justify-center"
            [innerHTML]="alertIconSvg()"
          ></span>
          <span class="text-sm font-medium">{{ message() }}</span>
        </div>

        @if (dismissible()) {
          <button
            type="button"
            class="flex items-center justify-center p-1 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
            (click)="onClose()"
            aria-label="Close error alert"
          >
            <span [innerHTML]="closeIconSvg()"></span>
          </button>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class ErrorAlertComponent {
  private sanitizer = inject(DomSanitizer);

  message = input.required<string>();
  dismissible = input<boolean>(true);

  closed = output<void>();

  isVisible = signal<boolean>(true);

  alertIconSvg = computed<SafeHtml>(() => {
    const svg = feather.icons['alert-triangle'].toSvg({ width: 20, height: 20 });
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });

  closeIconSvg = computed<SafeHtml>(() => {
    const svg = feather.icons['x'].toSvg({ width: 18, height: 18 });
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });

  onClose() {
    this.isVisible.set(false);
    this.closed.emit();
  }
}
