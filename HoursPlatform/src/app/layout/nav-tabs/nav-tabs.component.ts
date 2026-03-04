import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-nav-tabs',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="w-full bg-white border-b border-gray2">
      <div class="max-w-[1240px] w-full mx-auto px-6">
        <div class="flex justify-between items-end pt-12 mb-10">
          <h1 class="text-[40px] font-semibold text-black leading-none tracking-tight">PD Hours</h1>
          <app-button variant="primary">Lançar horas</app-button>
        </div>

        <div class="flex gap-[32px]">
          <button
            class="pb-4 text-[15px] font-medium transition-colors border-b-2 -mb-[1px] cursor-pointer"
            [class.text-black]="activeTab() === 'squads'"
            [class.border-primary]="activeTab() === 'squads'"
            [class.text-gray3]="activeTab() !== 'squads'"
            [class.border-transparent]="activeTab() !== 'squads'"
            (click)="activeTab.set('squads')"
          >
            Squads
          </button>
          <button
            class="pb-4 text-[15px] font-medium transition-colors border-b-2 -mb-[1px] cursor-pointer"
            [class.text-black]="activeTab() === 'usuarios'"
            [class.border-primary]="activeTab() === 'usuarios'"
            [class.text-gray3]="activeTab() !== 'usuarios'"
            [class.border-transparent]="activeTab() !== 'usuarios'"
            (click)="activeTab.set('usuarios')"
          >
            Usuários
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NavTabsComponent {
  activeTab = signal<'squads' | 'usuarios'>('squads');
}
