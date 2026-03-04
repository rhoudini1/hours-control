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
  variant = input<ButtonVariant>('primary');

  // When true, applies opacity-50 and cursor-not-allowed styles from tailwind config.
  disabled = input<boolean>(false);

  type = input<'button' | 'submit' | 'reset'>('button');

  // Optional custom classes to append to the button, for example for width or margin.
  customClass = input<string>('');

  buttonClass = computed(() => {
    const baseClass = `btn btn-${this.variant()}`;
    const extra = this.customClass();

    return extra ? `${baseClass} ${extra}` : baseClass;
  });
}
