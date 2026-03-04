import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'block bg-white rounded-card shadow-card',
  },
})
export class CardComponent {}
