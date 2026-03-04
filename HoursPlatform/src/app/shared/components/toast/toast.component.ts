import { Component, inject, computed } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastService } from '../../../core/services/toast.service';
// @ts-ignore
import * as feather from 'feather-icons';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toast.message()) {
      <div
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white shadow-card border border-gray-100 animate-slide-up"
        role="alert"
        aria-live="polite"
      >
        <span
          class="flex flex-shrink-0 items-center justify-center text-[var(--color-primary)]"
          [innerHTML]="checkIconSvg()"
        ></span>
        <span class="text-sm font-medium text-[var(--color-gray4)] whitespace-nowrap">
          {{ toast.message() }}
        </span>
      </div>
    }
  `,
  styles: `
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    .animate-slide-up {
      animation: slide-up 0.25s ease-out forwards;
    }
  `,
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);

  checkIconSvg = computed<SafeHtml>(() => {
    const svg = feather.icons['check-circle'].toSvg({ width: 20, height: 20 });
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
