import {
  Component,
  input,
  model,
  computed,
  signal,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// @ts-ignore
import * as feather from 'feather-icons';

export type InputState = 'normal' | 'success' | 'error';

@Component({
  selector: 'app-label',
  standalone: true,
  template: `
    <div class="flex flex-col gap-2 w-full font-sans">
      @if (label()) {
        <label
          [for]="inputId()"
          class="text-xs font-semibold tracking-wider text-[var(--color-gray3)] uppercase"
        >
          {{ label() }}
        </label>
      }

      <div
        class="relative flex items-center w-full px-4 py-3 rounded-lg border bg-white transition-all duration-200"
        [class]="containerClasses()"
      >
        <input
          [id]="inputId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [value]="value()"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="w-full bg-transparent outline-none text-base disabled:cursor-not-allowed"
          [class]="inputClasses()"
          [disabled]="disabled()"
        />

        @if (iconSvg()) {
          <span
            class="ml-2 flex flex-shrink-0 items-center justify-center transition-colors duration-200"
            [class]="iconClasses()"
            [innerHTML]="iconSvg()"
          ></span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class LabelComponent {
  private sanitizer = inject(DomSanitizer);

  label = input<string>('');
  inputId = input<string>(`input-\${Math.random().toString(36).substring(2, 9)}`);
  placeholder = input<string>('');
  type = input<string>('text');
  state = input<InputState>('normal');
  disabled = input<boolean>(false);

  value = model<string>('');

  isFocused = signal<boolean>(false);

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value.set(inputElement.value);
  }

  containerClasses = computed(() => {
    // Determine the border color based on focus and state
    if (this.state() === 'error') {
      return this.isFocused()
        ? 'border-[var(--color-error)] ring-1 ring-[var(--color-error)]'
        : 'border-[var(--color-error)]';
    }

    if (this.isFocused()) {
      return 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]';
    }

    return 'border-[var(--color-gray2)]';
  });

  inputClasses = computed(() => {
    // normal: gray 2 placeholder (via tailwind pseudo class)
    // state mapping: text color gets gray 4 when success or error
    let classes = 'placeholder:text-[var(--color-gray2)] ';

    if (this.state() === 'success' || this.state() === 'error' || this.value()) {
      classes += 'text-[var(--color-gray4)]';
    } else {
      classes += 'text-[var(--color-gray4)]'; // default text color
    }

    return classes;
  });

  iconSvg = computed<SafeHtml | null>(() => {
    if (this.state() === 'success') {
      const svg = feather.icons['check-circle'].toSvg({ width: 20, height: 20 });
      return this.sanitizer.bypassSecurityTrustHtml(svg);
    }
    if (this.state() === 'error') {
      const svg = feather.icons['alert-triangle'].toSvg({ width: 20, height: 20 });
      return this.sanitizer.bypassSecurityTrustHtml(svg);
    }
    return null;
  });

  iconClasses = computed(() => {
    if (this.state() === 'success') {
      return 'text-[var(--color-primary)]'; // blue color based on design mock
    }
    if (this.state() === 'error') {
      return 'text-[var(--color-error)]';
    }
    return '';
  });
}
