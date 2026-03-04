import { Component, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../shared/components/table/table.types';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CardComponent, ButtonComponent, TableComponent],
  template: `
    <div class="mt-8 flex flex-col justify-start w-full">
      @if (employees().length === 0) {
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

            <app-button variant="primary">Criar usuário</app-button>
          </div>
        </app-card>
      } @else {
        <h1 class="text-[32px] font-semibold text-black mb-8 tracking-tight">Lista de Usuários</h1>

        <app-card class="w-full max-w-[850px]">
          <div
            class="px-4 py-8 md:p-8 md:pb-10 flex flex-col items-center bg-white rounded-card overflow-hidden"
          >
            <app-table [columns]="tableColumns" [data]="employees()" class="w-full">
              <ng-template let-row="row" let-col="col">
                <span class="text-black font-medium pl-2">{{
                  col.key === 'squad.id' ? row.squad.id : row[col.key]
                }}</span>
              </ng-template>
            </app-table>

            <div class="mt-8">
              <app-button variant="primary">Criar usuário</app-button>
            </div>
          </div>
        </app-card>
      }
    </div>
  `,
})
export class EmployeesComponent {
  employees = signal<Employee[]>([
    { id: 1, name: 'João', estimatedHours: 8, squad: { id: 1, name: 'Squad 1' } },
    { id: 2, name: 'Pedro', estimatedHours: 9, squad: { id: 1, name: 'Squad 1' } },
    { id: 3, name: 'Fábio', estimatedHours: 6, squad: { id: 3, name: 'Squad 3' } },
    { id: 4, name: 'Lucas', estimatedHours: 8, squad: { id: 2, name: 'Squad 2' } },
  ]);

  tableColumns: TableColumn[] = [
    { label: 'Nome', key: 'name' },
    { label: 'Horas', key: 'estimatedHours' },
    { label: 'Squad ID', key: 'squad.id' },
  ];
}
