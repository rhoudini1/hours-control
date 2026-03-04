import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.types';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ApiService } from '../../core/services/api.service';
import { Squad } from '../../models/squad.model';
import { CreateSquadModalComponent } from './create-squad-modal/create-squad-modal.component';

@Component({
  selector: 'app-squads',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    TableComponent,
    LoadingSpinnerComponent,
    CreateSquadModalComponent,
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
            <app-button variant="primary" (click)="loadSquads()">Tentar novamente</app-button>
          </div>
        </app-card>
      }

      <!-- Empty state -->
      @else if (squads().length === 0) {
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
              Nenhuma squad cadastrada. Crie uma squad para começar.
            </p>

            <app-button variant="primary" (click)="openCreateModal()">Criar squad</app-button>
          </div>
        </app-card>
      }

      <!-- Data table -->
      @else {
        <h1 class="text-[32px] font-semibold text-black mb-8 tracking-tight">Lista de Squads</h1>

        <app-card class="w-full max-w-[850px]">
          <div
            class="px-4 py-8 md:p-8 md:pb-10 flex flex-col items-center bg-white rounded-card overflow-hidden"
          >
            <app-table [columns]="tableColumns" [data]="squads()" class="w-full">
              <ng-template let-row="row" let-col="col">
                @if (col.key === 'action') {
                  <div class="flex justify-end items-center pr-2">
                    <app-button variant="primary" (click)="goToSquad(row.id)"
                      >Visitar squad</app-button
                    >
                  </div>
                } @else {
                  <span class="text-black font-medium pl-2">{{ row[col.key] }}</span>
                }
              </ng-template>
            </app-table>

            <div class="mt-8">
              <app-button variant="primary" (click)="openCreateModal()">Criar squad</app-button>
            </div>
          </div>
        </app-card>
      }
    </div>

    <!-- Create Squad Modal -->
    <app-create-squad-modal #createModal (squadCreated)="loadSquads()" />
  `,
})
export class SquadsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  private readonly createModal = viewChild.required<CreateSquadModalComponent>('createModal');

  squads = signal<Squad[]>([]);

  isLoading = signal(true);

  errorMessage = signal<string | null>(null);

  tableColumns: TableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'name' },
    { label: '', key: 'action' },
  ];

  ngOnInit(): void {
    this.loadSquads();
  }

  openCreateModal() {
    this.createModal().open();
  }

  loadSquads(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.api.get<Squad[]>('squad').subscribe({
      next: (data) => {
        this.squads.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar as squads. Verifique sua conexão.');
        this.isLoading.set(false);
      },
    });
  }

  goToSquad(id: number) {
    this.router.navigate(['/squads', id]);
  }
}
