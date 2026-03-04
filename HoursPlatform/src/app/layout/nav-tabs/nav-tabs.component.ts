import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ReportModalService } from '../../core/services/report-modal.service';

@Component({
  selector: 'app-nav-tabs',
  standalone: true,
  imports: [ButtonComponent, RouterLink, RouterLinkActive],
  template: `
    <div class="w-full bg-white border-b border-gray2">
      <div class="max-w-[1240px] w-full mx-auto px-6">
        <div class="flex justify-between items-end pt-12 mb-10">
          <h1 class="text-[40px] font-semibold text-black leading-none tracking-tight">PD Hours</h1>
          <app-button variant="primary" (click)="reportModal.open()">Lançar horas</app-button>
        </div>

        <div class="flex gap-[32px]">
          <a
            routerLink="/squads"
            routerLinkActive="text-black border-primary"
            #squadsLink="routerLinkActive"
            [class.text-gray3]="!squadsLink.isActive"
            [class.border-transparent]="!squadsLink.isActive"
            class="pb-4 text-[15px] font-medium transition-colors border-b-2 -mb-[1px] cursor-pointer"
          >
            Squads
          </a>
          <a
            routerLink="/employees"
            routerLinkActive="text-black border-primary"
            #empLink="routerLinkActive"
            [class.text-gray3]="!empLink.isActive"
            [class.border-transparent]="!empLink.isActive"
            class="pb-4 text-[15px] font-medium transition-colors border-b-2 -mb-[1px] cursor-pointer"
          >
            Usuários
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NavTabsComponent {
  protected readonly reportModal = inject(ReportModalService);
}
