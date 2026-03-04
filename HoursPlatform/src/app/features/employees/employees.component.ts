import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.types';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ApiService } from '../../core/services/api.service';
import { Employee } from '../../models/employee.model';
import { CreateEmployeeModalComponent } from './create-employee-modal/create-employee-modal.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    TableComponent,
    LoadingSpinnerComponent,
    CreateEmployeeModalComponent,
  ],
  template: `
    <div class="mt-8 flex flex-col justify-start w-full">
      <!-- Loading state -->
      @if (isLoading()) {
        <app-card class="w-full max-w-[500px]">
          <app-loading-spinner containerPadding="py-16" />
        </app-card>
      }

      <!-- Error state -->
      @else if (errorMessage()) {
        <app-card class="w-full max-w-[500px]">
          <div class="flex flex-col items-center justify-center py-16 px-8 text-center">
            <p class="text-red-500 font-medium mb-6">{{ errorMessage() }}</p>
            <app-button variant="primary" (click)="loadEmployees()">Tentar novamente</app-button>
          </div>
        </app-card>
      }

      <!-- Empty state -->
      @else if (employees().length === 0) {
        <app-card class="w-full max-w-[500px]">
          <div
            class="flex flex-col items-center justify-center py-16 px-8 text-center bg-white rounded-card"
          >
            <!-- The icon box -->
            <div
              class="w-[120px] h-[120px] bg-[#EAECEF] rounded-[32px] flex items-center justify-center mb-10 relative"
            >
              <img src="sad.svg" alt="Sad Face" class="w-[60px] h-[60px]" />
            </div>

            <p class="text-[15px] font-medium text-[#acb5bd] mb-10">
              Nenhum usuário cadastrado. Crie um usuário para começar.
            </p>

            <app-button variant="primary" (click)="openCreateModal()">Criar usuário</app-button>
          </div>
        </app-card>
      }

      <!-- Data table -->
      @else {
        <h1 class="text-[32px] font-semibold text-black mb-8 tracking-tight">Lista de Usuários</h1>

        <app-card class="w-full max-w-[850px]">
          <div
            class="px-4 py-8 md:p-8 md:pb-10 flex flex-col items-center bg-white rounded-card overflow-hidden"
          >
            <app-table [columns]="tableColumns" [data]="employees()" class="w-full">
              <ng-template let-row="row" let-col="col">
                <span class="text-black font-medium pl-2">{{
                  col.key === 'squad.name' ? row.squad.name : row[col.key]
                }}</span>
              </ng-template>
            </app-table>

            <div class="mt-8">
              <app-button variant="primary" (click)="openCreateModal()">Criar usuário</app-button>
            </div>
          </div>
        </app-card>
      }
    </div>

    <!-- Create employee modal -->
    <app-create-employee-modal #createModal (employeeCreated)="loadEmployees()" />
  `,
})
export class EmployeesComponent implements OnInit {
  private readonly api = inject(ApiService);

  /** Reference to the create employee modal */
  private readonly createModal = viewChild.required<CreateEmployeeModalComponent>('createModal');

  /** The list of employees returned by the API */
  employees = signal<Employee[]>([]);

  /** True while the GET /employee request is in-flight */
  isLoading = signal(true);

  /** Holds an error message if the request fails */
  errorMessage = signal<string | null>(null);

  tableColumns: TableColumn[] = [
    { label: 'Nome', key: 'name' },
    { label: 'Horas', key: 'estimatedHours' },
    { label: 'Squad', key: 'squad.name' },
  ];

  ngOnInit(): void {
    this.loadEmployees();
  }

  /** Opens the create employee modal */
  openCreateModal(): void {
    this.createModal().open();
  }

  /** Fetches employees from the API. Can also be called to retry after an error. */
  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.api.get<Employee[]>('employee').subscribe({
      next: (data) => {
        this.employees.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os usuários. Verifique sua conexão.');
        this.isLoading.set(false);
      },
    });
  }
}
