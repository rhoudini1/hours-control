import { Component, input, contentChild, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableColumn } from './table.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="overflow-x-auto w-full rounded-lg shadow-sm border border-gray2">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead class="bg-primary text-white">
          <tr>
            @for (col of columns(); track col.key) {
              <th class="p-4 font-medium text-sm">{{ col.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr class="hover:bg-gray1 transition-colors border-b border-gray2 last:border-b-0">
              @for (col of columns(); track col.key) {
                <td class="p-4 text-sm text-gray4">
                  @if (cellTemplate()) {
                    <ng-container
                      *ngTemplateOutlet="cellTemplate()!; context: { row: row, col: col }"
                    ></ng-container>
                  } @else {
                    {{ row[col.key] }}
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length" class="p-4 text-center text-sm text-gray4">
                Nenhum dado encontrado
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class TableComponent {
  columns = input.required<TableColumn[]>();

  data = input.required<any[]>();

  // Optional template for rendering custom cell content (e.g., buttons, formatted values).
  // Context will include the full \`row\` data and the current \`col\` definition.
  cellTemplate = contentChild(TemplateRef);
}
