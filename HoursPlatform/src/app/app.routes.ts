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
  {
    path: 'squads/:id',
    loadComponent: () =>
      import('./features/squad-details/squad-details.component').then(
        (m) => m.SquadDetailsComponent,
      ),
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./features/employees/employees.component').then((m) => m.EmployeesComponent),
  },
];
