import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { CreateReportModalComponent } from '../../shared/components/create-report-modal/create-report-modal.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, NavTabsComponent, CreateReportModalComponent, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans" style="background-color: #F9FAFC;">
      <app-header></app-header>
      <app-nav-tabs></app-nav-tabs>

      <main class="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12">
        <ng-content></ng-content>
      </main>

      <!-- Global modal and toast — mounted once, visible from any page -->
      <app-create-report-modal />
      <app-toast />
    </div>
  `,
})
export class AppLayoutComponent {}
