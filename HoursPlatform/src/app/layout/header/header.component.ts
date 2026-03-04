import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="w-full bg-white relative z-10">
      <div class="max-w-[1240px] w-full mx-auto px-6 h-[88px] flex justify-between items-center">
        <img src="pds-logo.png" alt="PD Soluções" class="h-12" />
        <span class="text-[#acb5bd] text-[15px]">Interface para lançamento de horas</span>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
