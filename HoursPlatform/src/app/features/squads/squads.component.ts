import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.types';
import { Squad } from '../../models/squad.model';

@Component({
  selector: 'app-squads',
  standalone: true,
  imports: [CardComponent, ButtonComponent, TableComponent],
  template: `
    <div class="mt-8 flex flex-col justify-start w-full">
      @if (squads().length === 0) {
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

            <app-button variant="primary">Criar squad</app-button>
          </div>
        </app-card>
      } @else {
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
              <app-button variant="primary">Criar squad</app-button>
            </div>
          </div>
        </app-card>
      }
    </div>
  `,
})
export class SquadsComponent {
  private router = inject(Router);

  squads = signal<Squad[]>([
    { id: 1, name: 'Front-end' },
    { id: 2, name: 'Back-end' },
    { id: 3, name: 'Qualidade' },
    { id: 4, name: 'Mobile' },
  ]);

  tableColumns: TableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'name' },
    { label: '', key: 'action' },
  ];

  goToSquad(id: number) {
    this.router.navigate(['/squads', id]);
  }
}
