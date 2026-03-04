import {
  Component,
  input,
  model,
  computed,
  signal,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// @ts-ignore
import * as feather from 'feather-icons';

// Hardcoded hex values so inline [style] bindings always resolve
const COLOR_GRAY2 = '#dde2e5';
const COLOR_GRAY4 = '#495057';
const COLOR_ERROR = '#f03d3e';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="datepicker-wrapper">
      @if (label()) {
        <label [for]="inputId()" class="datepicker-label">
          {{ label() }}
        </label>
      }

      <div
        class="datepicker-container"
        [style.border-color]="borderColor()"
        [style.box-shadow]="focusRing()"
      >
        <span
          class="datepicker-icon"
          [style.color]="accentColor()"
          [innerHTML]="calendarIcon"
        ></span>

        <input
          [id]="inputId()"
          type="text"
          [placeholder]="placeholder()"
          [value]="displayValue()"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="datepicker-input"
          [style.color]="inputTextColor()"
          [disabled]="disabled()"
          maxlength="10"
          autocomplete="off"
        />
      </div>
    </div>
  `,
  styles: `
    app-datepicker {
      display: block;
      width: 100%;
    }

    .datepicker-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      font-family: var(--font-sans);
    }

    .datepicker-label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-gray3);
    }

    .datepicker-container {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--color-gray2);
      background-color: #fff;
      transition: all 0.2s ease-in-out;
    }

    .datepicker-icon {
      margin-right: 0.75rem;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease-in-out;
    }

    .datepicker-input {
      width: 100%;
      background-color: transparent;
      outline: none;
      font-size: 1rem;
      line-height: 1.5;
      border: none;
    }

    .datepicker-input:disabled {
      cursor: not-allowed;
    }

    .datepicker-input::placeholder {
      color: var(--color-gray2) !important;
      opacity: 1 !important;
    }
  `,
})
export class DatepickerComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);

  label = input<string>('');
  inputId = input<string>(`datepicker-${Math.random().toString(36).substring(2, 9)}`);
  placeholder = input<string>('DD/MM/YYYY');
  disabled = input<boolean>(false);

  /** Model value in YYYY-MM-DD format (for backend / parent binding) */
  value = model<string | null>(null);

  /** Display string in DD/MM/YYYY format shown in the input */
  displayValue = signal<string>('');
  isFocused = signal<boolean>(false);
  hasValidDate = signal<boolean>(false);
  isInvalidDate = signal<boolean>(false);

  calendarIcon: SafeHtml;

  constructor() {
    const svg = feather.icons['calendar'].toSvg({ width: 20, height: 20 });
    this.calendarIcon = this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  /**
   * On init, sync any external value (YYYY-MM-DD) into displayValue.
   * No effects needed — onInput handles everything during user interaction.
   */
  ngOnInit() {
    const val = this.value();
    if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [year, month, day] = val.split('-');
      this.displayValue.set(`${day}/${month}/${year}`);
      const isValid = this.isValidDate(day, month, year);
      this.hasValidDate.set(isValid);
      this.isInvalidDate.set(!isValid);
    }
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    // Strip non-digits, cap at 8
    const rawValue = inputElement.value.replace(/\D/g, '').slice(0, 8);

    // Build DD/MM/YYYY mask progressively
    let maskedValue = rawValue.substring(0, 2);
    if (rawValue.length > 2) maskedValue += '/' + rawValue.substring(2, 4);
    if (rawValue.length > 4) maskedValue += '/' + rawValue.substring(4, 8);

    // Update display — Angular will sync via [value] binding on next CD
    this.displayValue.set(maskedValue);

    // Also set the native input immediately so cursor doesn't jump
    inputElement.value = maskedValue;

    // Validate only when all 8 digits are entered
    if (rawValue.length === 8) {
      const day = rawValue.substring(0, 2);
      const month = rawValue.substring(2, 4);
      const year = rawValue.substring(4, 8);

      if (this.isValidDate(day, month, year)) {
        this.hasValidDate.set(true);
        this.isInvalidDate.set(false);
        this.value.set(`${year}-${month}-${day}`);
      } else {
        this.hasValidDate.set(false);
        this.isInvalidDate.set(true);
        this.value.set(null);
      }
    } else {
      this.hasValidDate.set(false);
      this.isInvalidDate.set(false);
      this.value.set(null);
    }
  }

  /** Validates DD, MM, YYYY as a real calendar date */
  private isValidDate(dayStr: string, monthStr: string, yearStr: string): boolean {
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  }

  // --- Inline style computed values ---

  borderColor = computed(() => {
    if (this.isInvalidDate()) return COLOR_ERROR;
    if (this.hasValidDate()) return COLOR_GRAY4;
    return COLOR_GRAY2;
  });

  focusRing = computed(() => {
    if (!this.isFocused()) return 'none';
    return `0 0 0 1px ${this.borderColor()}`;
  });

  accentColor = computed(() => {
    if (this.isInvalidDate()) return COLOR_ERROR;
    if (this.hasValidDate()) return COLOR_GRAY4;
    return COLOR_GRAY2;
  });

  inputTextColor = computed(() => {
    if (this.isInvalidDate()) return COLOR_ERROR;
    if (this.displayValue().length > 0) return COLOR_GRAY4;
    return COLOR_GRAY2;
  });
}
