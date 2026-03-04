import {
  Component,
  input,
  output,
  HostListener,
  computed,
  inject,
  effect,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
// @ts-ignore
import * as feather from 'feather-icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        (click)="closeModal.emit()"
      >
        <div
          class="relative w-full max-w-lg bg-white rounded-card shadow-card overflow-y-auto max-h-[90vh]"
          (click)="$event.stopPropagation()"
        >
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-4 right-4 text-gray4 hover:text-black transition-colors cursor-pointer"
            (click)="closeModal.emit()"
          >
            <span [innerHTML]="closeIconSvg()"></span>
          </button>

          <!-- Modal Content -->
          <div class="p-6 sm:p-8">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  private sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  isOpen = input<boolean>(false);
  closeModal = output<void>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.renderer.addClass(this.document.body, 'overflow-hidden');
      } else {
        this.renderer.removeClass(this.document.body, 'overflow-hidden');
      }
    });
  }

  closeIconSvg = computed<SafeHtml>(() => {
    const svg = feather.icons['x'].toSvg({ width: 24, height: 24 });
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.isOpen()) {
      this.closeModal.emit();
    }
  }
}
