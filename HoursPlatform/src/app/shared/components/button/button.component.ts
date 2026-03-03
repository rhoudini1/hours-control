import { Component, input, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'alternate';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type()" [disabled]="disabled()" [class]="buttonClass()">
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
})
export class ButtonComponent {
  /**
   * The variant of the button. Defaults to 'primary'.
   * Defines the visual style: primary (blue), secondary (purple), or alternate (white/bordered).
   */
  variant = input<ButtonVariant>('primary');

  /**
   * Whether the button is disabled.
   * When true, applies opacity-50 and cursor-not-allowed styles from tailwind config.
   */
  disabled = input<boolean>(false);

  /**
   * The native HTML button type. Defaults to 'button'.
   */
  type = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Optional custom classes to append to the button, for example for width or margin.
   */
  customClass = input<string>('');

  /**
   * Computes the final class list string using the variant, disabled state and any custom classes.
   */
  buttonClass = computed(() => {
    const baseClass = `btn btn-${this.variant()}`;
    const extra = this.customClass();

    return extra ? `${baseClass} ${extra}` : baseClass;
  });
}
