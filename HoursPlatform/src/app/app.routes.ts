import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'squads',
  },
  {
    path: 'squads',
    loadComponent: () =>
      import('./features/squads/squads.component').then((m) => m.SquadsComponent),
  },
];
