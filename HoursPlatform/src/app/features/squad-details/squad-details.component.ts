import { Component, signal, inject, computed } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { DatepickerComponent } from '../../shared/components/datepicker/datepicker.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.types';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ApiService } from '../../core/services/api.service';
import { SquadDetailsResponse } from '../../models/squad-details.model';

@Component({
  selector: 'app-squad-details',
  standalone: true,
  imports: [
    CardComponent,
    DatepickerComponent,
    ButtonComponent,
    TableComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="mt-8 flex flex-col justify-start w-full">
      <h1 class="text-[32px] font-semibold text-black mb-8 tracking-tight">Nome da Squad</h1>

      <app-card class="w-full max-w-[850px]">
        <div class="p-8 pb-10 flex flex-col items-center bg-white rounded-card overflow-hidden">
          <!-- Filters Row -->
          <div class="flex items-end gap-6 mb-12 w-full justify-center">
            <div class="w-[200px]">
              <app-datepicker
                label="Início"
                [value]="startDate()"
                (valueChange)="startDate.set($event)"
              ></app-datepicker>
            </div>
            <div class="w-[200px]">
              <app-datepicker
                label="Fim"
                [value]="endDate()"
                (valueChange)="endDate.set($event)"
              ></app-datepicker>
            </div>
            <div>
              <app-button variant="primary" (click)="onFilter()" customClass="h-[50px]"
                >Filtrar por data</app-button
              >
            </div>
          </div>

          <!-- Loading state -->
          @if (isLoading()) {
            <app-loading-spinner containerPadding="py-16" />
          }

          <!-- Error state -->
          @else if (errorMessage()) {
            <div class="flex flex-col items-center justify-center py-16 px-8 text-center w-full">
              <p class="text-red-500 font-medium mb-6">{{ errorMessage() }}</p>
              <app-button variant="primary" (click)="loadDetails()">Tentar novamente</app-button>
            </div>
          }

          <!-- Data -->
          @else {
            <!-- Member Hours Section -->
            <div class="w-full flex flex-col items-center mb-12">
              <h2 class="text-2xl font-medium text-black mb-6">Horas por membro</h2>

              <app-table [columns]="tableColumns" [data]="formattedReports()" class="w-full">
                <!-- Default rendering — no custom template needed -->
              </app-table>
            </div>

            <!-- Summary Section -->
            <div class="w-full flex flex-col items-center gap-10">
              <div class="flex flex-col items-center">
                <span class="text-xl text-black font-medium mb-4">Horas totais da squad</span>
                <span class="text-5xl font-semibold text-primary"
                  >{{ details().totalHours }} Horas</span
                >
              </div>

              <div class="flex flex-col items-center">
                <span class="text-xl text-black font-medium mb-4">Média de horas por dia</span>
                <span class="text-5xl font-semibold text-primary"
                  >{{ details().averageHours }} Horas/Dia</span
                >
              </div>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
})
export class SquadDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);

  /** True while the API request is in-flight */
  isLoading = signal(true);

  /** Holds an error message if the request fails */
  errorMessage = signal<string | null>(null);

  details = signal<SquadDetailsResponse>({ reports: [], totalHours: 0, averageHours: 0 });

  /**
   * Reports with createdAt formatted as a locale date string for display.
   * The raw ISO string from the API is kept in `details()` for potential re-use.
   */
  formattedReports = computed(() =>
    this.details().reports.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt).toLocaleDateString('pt-BR'),
    })),
  );

  tableColumns: TableColumn[] = [
    { label: 'Membro', key: 'name' },
    { label: 'Descrição', key: 'description' },
    { label: 'Horas', key: 'hours' },
    { label: 'Criado em', key: 'createdAt' },
  ];

  constructor() {
    // Read the squad id from the route and trigger the initial load
    this.route.params.subscribe((params) => {
      this.squadId = Number(params['id']);
      this.loadDetails();
    });
  }

  /** The squad id resolved from the route — set before any API call */
  private squadId!: number;

  /** Fetches squad details. Called on init and when the user clicks "Filtrar por data". */
  loadDetails(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Build optional query params — only include non-null date values
    let params = new HttpParams();
    const start = this.startDate();
    const end = this.endDate();
    if (start) params = params.set('startDate', start);
    if (end) params = params.set('endDate', end);

    this.api.get<SquadDetailsResponse>(`squad/${this.squadId}`, params).subscribe({
      next: (data) => {
        this.details.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Não foi possível carregar os dados da squad. Verifique sua conexão.',
        );
        this.isLoading.set(false);
      },
    });
  }

  onFilter(): void {
    this.loadDetails();
  }
}
