import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { LabelComponent } from '../label/label.component';
import { ButtonComponent } from '../button/button.component';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { ApiService } from '../../../core/services/api.service';
import { ReportModalService } from '../../../core/services/report-modal.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

interface ApiError {
  message: string;
  propertyName: string;
}

interface Report {
  id: number;
  description: string;
  spentHours: number;
  createdAt: string;
  employeeId: number;
}

@Component({
  selector: 'app-create-report-modal',
  standalone: true,
  imports: [ModalComponent, LabelComponent, ButtonComponent, ErrorAlertComponent],
  template: `
    <app-modal [isOpen]="reportModalService.isOpen()" (closeModal)="close()">
      <div class="flex flex-col gap-6">
        <!-- Title -->
        <h2 class="text-[32px] font-bold text-black text-center">Criar lançamento</h2>

        <!-- General error alert (used for employeeId errors per spec) -->
        @if (generalError()) {
          <app-error-alert
            [message]="generalError()!"
            [dismissible]="true"
            (closed)="generalError.set(null)"
          />
        }

        <!-- ID do Usuário -->
        <div class="flex flex-col gap-1">
          <app-label
            label="ID do Usuário"
            placeholder="Digite o ID do funcionário"
            type="number"
            [(value)]="employeeIdStr"
            [state]="employeeIdError() ? 'error' : 'normal'"
          />
          @if (employeeIdError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ employeeIdError() }}</p>
          }
        </div>

        <!-- Horas Gastas -->
        <div class="flex flex-col gap-1">
          <app-label
            label="Horas Gastas"
            placeholder="Digite a quantidade de horas"
            type="number"
            [(value)]="spentHoursStr"
            [state]="spentHoursError() ? 'error' : 'normal'"
          />
          @if (spentHoursError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ spentHoursError() }}</p>
          }
        </div>

        <!-- Descrição (textarea) -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold tracking-wider text-[var(--color-gray3)] uppercase">
            Descrição
          </label>
          <div
            class="relative flex items-start w-full px-4 py-3 rounded-lg border bg-white transition-all duration-200"
            [class]="descriptionContainerClasses()"
          >
            <textarea
              rows="4"
              placeholder="Exemplo de texto de descrição da tarefa executada."
              [value]="description()"
              (input)="onDescriptionInput($event)"
              (focus)="descriptionFocused.set(true)"
              (blur)="descriptionFocused.set(false)"
              class="w-full bg-transparent outline-none text-base resize-none placeholder:text-[var(--color-gray2)] text-[var(--color-gray4)]"
            ></textarea>
          </div>
          @if (descriptionError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ descriptionError() }}</p>
          }
        </div>

        <!-- Submit button -->
        <app-button variant="primary" [disabled]="isSubmitting()" (click)="submit()" class="w-full">
          {{ isSubmitting() ? 'Criando...' : 'Criar lançamento' }}
        </app-button>
      </div>
    </app-modal>
  `,
})
export class CreateReportModalComponent {
  protected readonly reportModalService = inject(ReportModalService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  // Form field signals
  employeeIdStr = signal('');
  spentHoursStr = signal('');
  description = signal('');

  // Focus state for the textarea
  descriptionFocused = signal(false);

  // Validation error signals
  employeeIdError = signal<string | null>(null);
  spentHoursError = signal<string | null>(null);
  descriptionError = signal<string | null>(null);

  /** Errors with propertyName 'employeeId' go here (shown as an alert banner per spec) */
  generalError = signal<string | null>(null);

  isSubmitting = signal(false);

  onDescriptionInput(event: Event): void {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  descriptionContainerClasses(): string {
    if (this.descriptionError()) {
      return this.descriptionFocused()
        ? 'border-[var(--color-error)] ring-1 ring-[var(--color-error)]'
        : 'border-[var(--color-error)]';
    }
    if (this.descriptionFocused()) {
      return 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]';
    }
    return 'border-[var(--color-gray2)]';
  }

  close(): void {
    this.reportModalService.close();
  }

  submit(): void {
    // Clear previous errors
    this.employeeIdError.set(null);
    this.spentHoursError.set(null);
    this.descriptionError.set(null);
    this.generalError.set(null);

    const employeeId = Number(this.employeeIdStr());
    const spentHours = Number(this.spentHoursStr());
    const description = this.description().trim();

    this.isSubmitting.set(true);

    this.api.post<Report>('report', { description, spentHours, employeeId }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.reset();
        this.reportModalService.close();
        this.reportModalService.notifyCreated();
        this.toast.show('Lançamento de horas cadastrado com sucesso');
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        if (err.status === 400 && err.error?.errors) {
          const errors: ApiError[] = err.error.errors;

          for (const error of errors) {
            const prop = error.propertyName?.toLowerCase();

            if (prop === 'employeeid') {
              // Per spec: employeeId errors go to the error alert banner
              this.generalError.set(error.message);
            } else if (prop === 'spenthours') {
              this.spentHoursError.set(error.message);
            } else if (prop === 'description') {
              this.descriptionError.set(error.message);
            } else {
              this.generalError.set(error.message);
            }
          }
        } else {
          this.generalError.set('Ocorreu um erro inesperado. Tente novamente.');
        }
      },
    });
  }

  private reset(): void {
    this.employeeIdStr.set('');
    this.spentHoursStr.set('');
    this.description.set('');
    this.employeeIdError.set(null);
    this.spentHoursError.set(null);
    this.descriptionError.set(null);
    this.generalError.set(null);
    this.isSubmitting.set(false);
  }
}
