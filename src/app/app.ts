import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuGeneral } from './components/menu-general/menu-general';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

import * as AOS from 'aos';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuGeneral, Header, Footer],  
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('phost');
  private router = inject(Router);

  mostrarMenu: boolean = true;

  rutasSinMenu: string[] = ['/auth', '/404', '/error'];

  ngOnInit(){
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: false,  // ← Cambia esto
    mirror: false,
    offset: 50,
    disable: false, // ← Asegúrate de que no esté deshabilitado
  });
    this.router.events.pipe(
      filter(evento => evento instanceof NavigationEnd)
    ).subscribe((evento: any) => {
      
      const urlActual = evento.urlAfterRedirects;
      this.mostrarMenu = !this.rutasSinMenu.includes(urlActual);
      
    });
  }
}


