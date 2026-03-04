import { Component, inject, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LabelComponent } from '../../../shared/components/label/label.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ErrorAlertComponent } from '../../../shared/components/error-alert/error-alert.component';
import { ApiService } from '../../../core/services/api.service';
import { Squad } from '../../../models/squad.model';
import { HttpErrorResponse } from '@angular/common/http';

interface ApiError {
  message: string;
  propertyName: string;
}

@Component({
  selector: 'app-create-squad-modal',
  standalone: true,
  imports: [ModalComponent, LabelComponent, ButtonComponent, ErrorAlertComponent],
  template: `
    <app-modal [isOpen]="isOpen()" (closeModal)="close()">
      <div class="flex flex-col gap-6">
        <!-- Title -->
        <h2 class="text-[32px] font-bold text-black text-center">Criar Squad</h2>

        <!-- Form -->
        <div class="flex flex-col gap-1">
          <app-label
            label="Nome da squad"
            placeholder="Digite o nome da squad"
            [(value)]="name"
            [state]="nameError() ? 'error' : 'normal'"
          />
          @if (nameError()) {
            <p class="text-xs text-[var(--color-error)] mt-1">{{ nameError() }}</p>
          }
        </div>

        <!-- General error alert -->
        @if (generalError()) {
          <app-error-alert
            [message]="generalError()!"
            [dismissible]="true"
            (closed)="generalError.set(null)"
          />
        }

        <!-- Submit button -->
        <app-button variant="primary" [disabled]="isSubmitting()" (click)="submit()" class="w-full">
          {{ isSubmitting() ? 'Criando...' : 'Criar squad' }}
        </app-button>
      </div>
    </app-modal>
  `,
})
export class CreateSquadModalComponent {
  private readonly api = inject(ApiService);

  /** Controls modal visibility from the parent */
  isOpen = signal(false);

  /** Emitted when the squad is created successfully */
  squadCreated = output<Squad>();

  name = signal('');
  nameError = signal<string | null>(null);
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
    this.generalError.set(null);

    const name = this.name().trim();

    this.isSubmitting.set(true);

    this.api.post<Squad>('squad', { name }).subscribe({
      next: (squad) => {
        this.isSubmitting.set(false);
        this.close();
        this.squadCreated.emit(squad);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        if (err.status === 400 && err.error?.errors) {
          // Map field-level vs general errors
          const errors: ApiError[] = err.error.errors;
          let hasFieldError = false;

          for (const error of errors) {
            // The API uses camelCase 'name' as propertyName for the squad name field
            if (error.propertyName?.toLowerCase() === 'name') {
              this.nameError.set(error.message);
              hasFieldError = true;
            } else {
              this.generalError.set(error.message);
            }
          }

          // If there were errors with no propertyName match, show first as general
          if (!hasFieldError && errors.length > 0 && !this.generalError()) {
            this.generalError.set(errors[0].message);
          }
        } else {
          this.generalError.set('Ocorreu um erro inesperado. Tente novamente.');
        }
      },
    });
  }

  private reset() {
    this.name.set('');
    this.nameError.set(null);
    this.generalError.set(null);
    this.isSubmitting.set(false);
  }
}
