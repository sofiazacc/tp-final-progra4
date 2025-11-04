
import { Component } from '@angular/core';
import { Feed } from './components/feed/feed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Feed], 
  template: `
    <div class="container">
      <app-feed></app-feed> 
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1rem;
      background: #fafafa;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'mi-app';
}