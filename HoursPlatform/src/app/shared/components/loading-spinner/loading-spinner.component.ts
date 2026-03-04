import { Component, input } from '@angular/core';

/**
 * Reusable loading spinner component.
 * Displays a centered animated ring while data is being fetched.
 *
 * Usage:
 *   <app-loading-spinner />
 *   <app-loading-spinner size="sm" />
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div
      class="flex items-center justify-center w-full"
      [class]="containerClass()"
      aria-label="Carregando..."
      role="status"
    >
      <span
        class="inline-block rounded-full border-4 border-gray-2 animate-spin"
        [class]="spinnerClass()"
        style="border-top-color: var(--color-primary, #245bca);"
      ></span>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  /** Controls the size of the spinner: 'sm' | 'md' | 'lg' */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** Extra Tailwind classes for the outer container */
  containerPadding = input<string>('py-12');

  protected spinnerClass() {
    const sizes: Record<string, string> = {
      sm: 'w-6 h-6 border-2',
      md: 'w-10 h-10 border-4',
      lg: 'w-16 h-16 border-4',
    };
    return sizes[this.size()] ?? sizes['md'];
  }

  protected containerClass() {
    return this.containerPadding();
  }
}
