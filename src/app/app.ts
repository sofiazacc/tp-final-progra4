import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuGeneral } from './components/menu-general/menu-general';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

import { filter } from 'rxjs';
import { Auth } from './pages/auth/auth';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuGeneral, Header, Footer, Auth],  
  templateUrl: './app.html',
  styleUrl: './app.css',
  
})
export class App implements OnInit{
  protected readonly title = signal('phost');
  private router = inject(Router);

  mostrarMenu: boolean = true;

  rutasSinMenu: string[] = ['/auth', '/404', '/error'];

  ngOnInit(){

    this.router.events.pipe(
      filter(evento => evento instanceof NavigationEnd)
    ).subscribe((evento: any) => {
      
      const urlActual = evento.urlAfterRedirects;
      this.mostrarMenu = !this.rutasSinMenu.includes(urlActual);
    });
  }
}


