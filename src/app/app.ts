import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuGeneral } from './components/menu-general/menu-general';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuGeneral, Header, Footer],  
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('phost');

  ngOnInit(){
    AOS.init({
      duration: 800,
      easing: 'ease-in-out', 
      once: true,
      mirror: false, 
      offset: 120,
    });
  }
}


