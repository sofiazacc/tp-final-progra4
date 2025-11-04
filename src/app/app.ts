import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuGeneral } from './components/menu-general/menu-general';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuGeneral],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('phost');
}
