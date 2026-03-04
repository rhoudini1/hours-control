import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { DatepickerComponent } from '../../shared/components/datepicker/datepicker.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.types';
import { SquadDetailsResponse } from '../../models/squad-details.model';

@Component({
  selector: 'app-squad-details',
  standalone: true,
  imports: [CardComponent, DatepickerComponent, ButtonComponent, TableComponent],
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

          <!-- Member Hours Section -->
          <div class="w-full flex flex-col items-center mb-12">
            <h2 class="text-2xl font-medium text-black mb-6">Horas por membro</h2>

            <app-table [columns]="tableColumns" [data]="details().reports" class="w-full">
              <!-- Using default rendering based on table component, no custom template needed since simple cell mapping -->
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
        </div>
      </app-card>
    </div>
  `,
})
export class SquadDetailsComponent {
  private route = inject(ActivatedRoute);

  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);

  details = signal<SquadDetailsResponse>({
    reports: [
      {
        name: 'João',
        description: 'Desenvolvi tal funcionalidade.',
        hours: 8,
        createdAt: '01/02/2022',
      },
      {
        name: 'Pedro',
        description: 'Resolvi bug na aplicação X.',
        hours: 16,
        createdAt: '01/02/2022',
      },
      { name: 'Marcelo', description: 'Montagem de ambiente.', hours: 3, createdAt: '01/02/2022' },
    ],
    totalHours: 27,
    averageHours: 3,
  });

  tableColumns: TableColumn[] = [
    { label: 'Membro', key: 'name' },
    { label: 'Descrição', key: 'description' },
    { label: 'Horas', key: 'hours' },
    { label: 'Criado em', key: 'createdAt' },
  ];

  constructor() {
    this.route.params.subscribe((params) => {
      // Future: load data based on params['id']
    });
  }

  onFilter() {
    // Future: load data based on startDate and endDate signals interacting with the backend
    console.log('Filtering by date:', this.startDate(), this.endDate());
  }
}
