import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuGeneral } from './components/menu-general/menu-general';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuGeneral, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('phost');
}
