import { Component, inject, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LabelComponent } from '../../../shared/components/label/label.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ErrorAlertComponent } from '../../../shared/components/error-alert/error-alert.component';
import { ApiService } from '../../../core/services/api.service';
import { Employee } from '../../../models/employee.model';
import { HttpErrorResponse } from '@angular/common/http';

interface ApiError {
  message: string;
  propertyName: string;
}

@Component({
  selector: 'app-create-employee-modal',
  standalone: true,
  imports: [ModalComponent, LabelComponent, ButtonComponent, ErrorAlertComponent],
  template: `
    <app-modal [isOpen]="isOpen()" (closeModal)="close()">
      <div class="flex flex-col gap-6">
        <!-- Title -->
        <h2 class="text-[32px] font-bold text-black text-center">Criar Usuário</h2>

        <!-- General error alert -->
        @if (generalError()) {
          <app-error-alert
            [message]="generalError()!"
            [dismissible]="true"
            (closed)="generalError.set(null)"
          />
        }

        <!-- Nome do usuário -->
        <div class="flex flex-col gap-1">
          <app-label
            label="Nome do usuário"
            placeholder="Digite o nome da squad"
            [(value)]="name"
            [state]="nameError() ? 'error' : 'normal'"
          />
          @if (nameError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ nameError() }}</p>
          }
        </div>

        <!-- Horas estimadas de trabalho -->
        <div class="flex flex-col gap-1">
          <app-label
            label="Horas estimadas de trabalho"
            placeholder="Digite a quantidade de horas"
            type="number"
            [(value)]="estimatedHoursStr"
            [state]="estimatedHoursError() ? 'error' : 'normal'"
          />
          @if (estimatedHoursError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ estimatedHoursError() }}</p>
          }
        </div>

        <!-- Squad -->
        <div class="flex flex-col gap-1">
          <app-label
            label="Squad"
            placeholder="Digite o Id da squad"
            type="number"
            [(value)]="squadIdStr"
            [state]="squadIdError() ? 'error' : 'normal'"
          />
          @if (squadIdError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ squadIdError() }}</p>
          }
        </div>

        <!-- Submit button -->
        <app-button variant="primary" [disabled]="isSubmitting()" (click)="submit()" class="w-full">
          {{ isSubmitting() ? 'Criando...' : 'Criar usuário' }}
        </app-button>
      </div>
    </app-modal>
  `,
})
export class CreateEmployeeModalComponent {
  private readonly api = inject(ApiService);

  /** Controls modal visibility from the parent */
  isOpen = signal(false);

  /** Emitted when an employee is created successfully */
  employeeCreated = output<Employee>();

  // Form field signals (strings for two-way binding via LabelComponent)
  name = signal('');
  estimatedHoursStr = signal('');
  squadIdStr = signal('');

  // Validation error signals
  nameError = signal<string | null>(null);
  estimatedHoursError = signal<string | null>(null);
  squadIdError = signal<string | null>(null);
  generalError = signal<string | null>(null);

  isSubmitting = signal(false);

  open() {
    this.reset();
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  submit() {
    // Clear previous errors
    this.nameError.set(null);
    this.estimatedHoursError.set(null);
    this.squadIdError.set(null);
    this.generalError.set(null);

    const name = this.name().trim();
    const estimatedHours = Number(this.estimatedHoursStr());
    const squadId = Number(this.squadIdStr());

    this.isSubmitting.set(true);

    this.api.post<Employee>('employee', { name, estimatedHours, squadId }).subscribe({
      next: (employee) => {
        this.isSubmitting.set(false);
        this.close();
        this.employeeCreated.emit(employee);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        if (err.status === 400 && err.error?.errors) {
          const errors: ApiError[] = err.error.errors;

          for (const error of errors) {
            const prop = error.propertyName?.toLowerCase();
            if (prop === 'name') {
              this.nameError.set(error.message);
            } else if (prop === 'estimatedhours') {
              this.estimatedHoursError.set(error.message);
            } else if (prop === 'squadid') {
              this.squadIdError.set(error.message);
            } else {
              // No matching field — show as general error
              this.generalError.set(error.message);
            }
          }
        } else {
          this.generalError.set('Ocorreu um erro inesperado. Tente novamente.');
        }
      },
    });
  }

  private reset() {
    this.name.set('');
    this.estimatedHoursStr.set('');
    this.squadIdStr.set('');
    this.nameError.set(null);
    this.estimatedHoursError.set(null);
    this.squadIdError.set(null);
    this.generalError.set(null);
    this.isSubmitting.set(false);
  }
}
